/**
 * ═══════════════════════════════════════════════════════════════════════════
 * CUSTOM PLAYWRIGHT REPORTER
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * File này định nghĩa một Custom Reporter cho Playwright Test Runner.
 * Reporter là "người giám sát" theo dõi và báo cáo kết quả test.
 *
 * CÁC METHODS CỦA REPORTER:
 * ─────────────────────────────────────────────────────────────────────────────
 * | Method        | Khi nào được gọi?                                         |
 * |---------------|-----------------------------------------------------------|
 * | onBegin       | Bắt đầu chạy test (1 lần duy nhất)                        |
 * | onTestBegin   | Mỗi khi 1 test case bắt đầu                               |
 * | onStepBegin   | Mỗi khi 1 step trong test bắt đầu (test.step())           |
 * | onStepEnd     | Mỗi khi 1 step kết thúc                                   |
 * | onTestEnd     | Mỗi khi 1 test case kết thúc                              |
 * | onStdOut      | Mỗi khi test gọi console.log()                            |
 * | onStdErr      | Mỗi khi test gọi console.error()                          |
 * | onError       | Khi có lỗi toàn cục (worker crash, unhandled exception)   |
 * | onEnd         | Kết thúc toàn bộ test run                                 |
 * | onExit        | Ngay trước khi test runner thoát (cleanup)                |
 * | printsToStdio | Báo Playwright rằng reporter này ghi ra console           |
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * CÁCH SỬ DỤNG:
 *   Trong playwright.config.ts, set: reporter: './custom.ts'
 */

import type {
  FullConfig,
  FullResult,
  Reporter,
  Suite,
  TestCase,
  TestResult,
  TestStep,
  TestError,
} from "@playwright/test/reporter";

// ═══════════════════════════════════════════════════════════════════════════
// ANSI ESCAPE CODES - Mã màu cho terminal
// ═══════════════════════════════════════════════════════════════════════════
// ANSI Escape Codes là chuỗi ký tự đặc biệt giúp thay đổi màu sắc text
// trong terminal. Format: '\x1b[<code>m' với code là số tương ứng màu.
// Ví dụ: '\x1b[31m' = màu đỏ, '\x1b[0m' = reset về mặc định

const c = {
  reset: "\x1b[0m", // Reset về màu mặc định
  bold: "\x1b[1m", // In đậm
  dim: "\x1b[2m", // Mờ nhạt
  italic: "\x1b[3m", // In nghiêng
  underline: "\x1b[4m", // Gạch chân

  // Màu chữ (Foreground)
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  magenta: "\x1b[35m",
  cyan: "\x1b[36m",
  white: "\x1b[37m",
  gray: "\x1b[90m",

  // Màu nền (Background)
  bgRed: "\x1b[41m",
  bgGreen: "\x1b[42m",
  bgYellow: "\x1b[43m",
  bgBlue: "\x1b[44m",
};

// ═══════════════════════════════════════════════════════════════════════════
// HÀM TIỆN ÍCH (HELPER FUNCTIONS)
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Chuyển đổi milliseconds thành format dễ đọc
 * Ví dụ: 1500 → "1.50s", 65000 → "1m 5s"
 */
function formatDuration(ms: number): string {
  if (ms < 1000) return `${ms}ms`; // Dưới 1 giây
  if (ms < 60000) return `${(ms / 1000).toFixed(2)}s`; // Dưới 1 phút
  // Trên 1 phút: hiện dạng "Xm Ys"
  return `${Math.floor(ms / 60000)}m ${((ms % 60000) / 1000).toFixed(0)}s`;
}

/**
 * Tạo thanh progress bar dạng text
 * Ví dụ: [########........] 50%
 *        |--passed--|--failed--|--remaining--|
 */
function progressBar(passed: number, failed: number, total: number): string {
  const width = 25; // Độ rộng thanh progress
  const p = Math.round((passed / Math.max(total, 1)) * width);
  const f = Math.round((failed / Math.max(total, 1)) * width);
  return (
    `${c.green}${"#".repeat(p)}${c.reset}` + // Phần passed: ####
    `${c.red}${"x".repeat(f)}${c.reset}` + // Phần failed: xxxx
    `${c.dim}${".".repeat(Math.max(0, width - p - f))}${c.reset}` // Còn lại: ....
  );
}

/**
 * Lấy thời gian hiện tại dạng HH:MM:SS
 */
function timestamp(): string {
  return new Date().toLocaleTimeString("en-US", { hour12: false });
}

// ═══════════════════════════════════════════════════════════════════════════
// CUSTOM REPORTER CLASS
// ═══════════════════════════════════════════════════════════════════════════
// Implement interface Reporter của Playwright
// Tất cả methods đều là optional, chỉ cần implement những gì bạn cần

class CustomReporter implements Reporter {
  // ─────────────────────────────────────────────────────────────────────────
  // BIẾN LƯU TRẠNG THÁI
  // ─────────────────────────────────────────────────────────────────────────
  private startTime = 0; // Thời điểm bắt đầu test run
  private passed = 0; // Số test PASSED
  private failed = 0; // Số test FAILED
  private skipped = 0; // Số test SKIPPED
  private total = 0; // Tổng số test
  private current = 0; // Test đang chạy (thứ mấy)
  private failures: { title: string; error: string }[] = []; // Danh sách test lỗi
  private globalErrors: string[] = []; // Lỗi toàn cục (worker crash)
  private logs: Map<string, string[]> = new Map(); // Console logs theo test ID
  private currentTestId = ""; // ID của test đang chạy

  // ─────────────────────────────────────────────────────────────────────────
  // onBegin - Được gọi KHI BẮT ĐẦU chạy test
  // ─────────────────────────────────────────────────────────────────────────
  // Tham số:
  //   - config: Cấu hình Playwright (workers, retries, v.v.)
  //   - suite: Cây chứa toàn bộ test cases
  onBegin(config: FullConfig, suite: Suite) {
    this.startTime = Date.now(); // Ghi nhận thời điểm bắt đầu
    this.total = suite.allTests().length; // Đếm tổng số test

    // In header đẹp
    console.log("");
    console.log(`${c.cyan}${"=".repeat(65)}${c.reset}`);
    console.log(
      `  ${c.bold}PLAYWRIGHT TEST RUNNER${c.reset}  ${c.dim}v${config.version}${c.reset}`,
    );
    console.log(`${c.cyan}${"=".repeat(65)}${c.reset}`);
    console.log(`  ${c.gray}Started:${c.reset} ${timestamp()}`);
    console.log(
      `  ${c.gray}Tests:${c.reset}   ${c.bold}${this.total}${c.reset}  ${c.gray}Workers:${c.reset} ${c.bold}${config.workers}${c.reset}`,
    );
    console.log(`${c.dim}${"─".repeat(65)}${c.reset}`);
    console.log("");
  }

  // ─────────────────────────────────────────────────────────────────────────
  // onTestBegin - Được gọi MỖI KHI 1 TEST BẮT ĐẦU
  // ─────────────────────────────────────────────────────────────────────────
  // Tham số:
  //   - test: Thông tin test case (title, file, location, v.v.)
  onTestBegin(test: TestCase) {
    this.current++; // Tăng bộ đếm test
    this.currentTestId = test.id; // Lưu ID test hiện tại
    this.logs.set(test.id, []); // Khởi tạo mảng logs cho test này

    // Lấy tên file (bỏ phần đường dẫn)
    const file = test.location.file.split(/[\\\/]/).pop();
    const progress = `${c.gray}[${this.current}/${this.total}]${c.reset}`;

    // In dòng thông báo test bắt đầu
    console.log(
      `${progress} ${c.blue}>>>${c.reset} ${c.dim}${file}${c.reset} ${c.bold}>${c.reset} ${test.title}`,
    );
  }

  // ─────────────────────────────────────────────────────────────────────────
  // onStepBegin - Được gọi MỖI KHI 1 STEP BẮT ĐẦU
  // ─────────────────────────────────────────────────────────────────────────
  // Step = các bước trong test, được định nghĩa bằng test.step()
  // Lưu ý: Playwright cũng tạo các "internal steps" (click, fill, v.v.)
  // nên cần filter chỉ lấy category === 'test.step'
  onStepBegin(test: TestCase, result: TestResult, step: TestStep) {
    // Không log ở đây để tránh output bị lặp (sẽ log trong onStepEnd)
  }

  // ─────────────────────────────────────────────────────────────────────────
  // onStepEnd - Được gọi MỖI KHI 1 STEP KẾT THÚC
  // ─────────────────────────────────────────────────────────────────────────
  // Tham số:
  //   - step.category: Loại step ('test.step' cho custom, 'pw:api' cho Playwright)
  //   - step.duration: Thời gian chạy (ms)
  //   - step.error: Lỗi nếu step fail
  onStepEnd(test: TestCase, result: TestResult, step: TestStep) {
    // Chỉ hiện các step do user định nghĩa (test.step()), bỏ qua internal steps
    if (step.category === "test.step") {
      const duration = formatDuration(step.duration);
      const icon = step.error ? `${c.red}x${c.reset}` : `${c.green}+${c.reset}`;
      console.log(
        `    ${c.dim}|${c.reset} ${icon} ${c.dim}${step.title}${c.reset} ${c.gray}(${duration})${c.reset}`,
      );
    }
  }

  // ─────────────────────────────────────────────────────────────────────────
  // onTestEnd - Được gọi MỖI KHI 1 TEST KẾT THÚC
  // ─────────────────────────────────────────────────────────────────────────
  // Tham số:
  //   - result.status: 'passed' | 'failed' | 'skipped' | 'timedOut'
  //   - result.duration: Thời gian chạy test (ms)
  //   - result.error: Thông tin lỗi nếu test fail
  //   - result.retry: Số lần retry
  onTestEnd(test: TestCase, result: TestResult) {
    const duration = formatDuration(result.duration);
    const file = test.location.file.split(/[\\\/]/).pop();

    // Xác định status và màu sắc
    let status: string;
    switch (result.status) {
      case "passed":
        this.passed++;
        status = `${c.bgGreen}${c.bold} PASS ${c.reset}`;
        break;
      case "failed":
        this.failed++;
        status = `${c.bgRed}${c.bold} FAIL ${c.reset}`;
        // Lưu lại thông tin test fail để hiện ở cuối
        this.failures.push({
          title: `${file} > ${test.title}`,
          error: result.error?.message?.split("\n")[0] || "Unknown",
        });
        break;
      case "skipped":
        this.skipped++;
        status = `${c.bgYellow}${c.bold} SKIP ${c.reset}`;
        break;
      case "timedOut":
        this.failed++;
        status = `${c.bgRed}${c.bold} TIME ${c.reset}`;
        break;
      default:
        status = `${c.gray}[${result.status}]${c.reset}`;
    }

    // In kết quả test
    console.log(
      `    ${c.dim}└${c.reset} ${status} ${c.dim}(${duration})${c.reset}`,
    );

    // Thông báo nếu đây là retry
    if (result.retry > 0) {
      console.log(`      ${c.yellow}^ Retry #${result.retry}${c.reset}`);
    }

    // Hiện console logs nếu có (giới hạn 3 dòng đầu)
    const testLogs = this.logs.get(test.id) || [];
    if (testLogs.length > 0) {
      console.log(`      ${c.magenta}Logs:${c.reset}`);
      testLogs.slice(0, 3).forEach((log) => {
        // Cắt ngắn log nếu quá dài
        console.log(
          `      ${c.dim}| ${log.substring(0, 60)}${log.length > 60 ? "..." : ""}${c.reset}`,
        );
      });
    }

    console.log("");
  }

  // ─────────────────────────────────────────────────────────────────────────
  // onStdOut - BẮT console.log() TỪ TEST
  // ─────────────────────────────────────────────────────────────────────────
  // Mỗi khi test gọi console.log(), method này được trigger
  // Dùng để capture và lưu logs để hiện trong report
  onStdOut(chunk: string | Buffer, test?: TestCase) {
    const text = chunk.toString().trim();
    if (test && text) {
      const logs = this.logs.get(test.id) || [];
      logs.push(text);
      this.logs.set(test.id, logs);
    }
  }

  // ─────────────────────────────────────────────────────────────────────────
  // onStdErr - BẮT console.error() TỪ TEST
  // ─────────────────────────────────────────────────────────────────────────
  // Tương tự onStdOut nhưng cho stderr
  onStdErr(chunk: string | Buffer, test?: TestCase) {
    const text = chunk.toString().trim();
    if (test && text) {
      const logs = this.logs.get(test.id) || [];
      logs.push(`[ERR] ${text}`); // Đánh dấu đây là error log
      this.logs.set(test.id, logs);
    }
  }

  // ─────────────────────────────────────────────────────────────────────────
  // onError - ĐƯỢC GỌI KHI CÓ LỖI TOÀN CỤC
  // ─────────────────────────────────────────────────────────────────────────
  // Các lỗi này không thuộc về test cụ thể nào, ví dụ:
  //   - Worker process crash
  //   - Unhandled exception
  //   - Lỗi trong fixture
  onError(error: TestError) {
    this.globalErrors.push(error.message || "Unknown global error");
    console.log("");
    console.log(`${c.bgRed}${c.bold} GLOBAL ERROR ${c.reset}`);
    console.log(`${c.red}${error.message}${c.reset}`);
    console.log("");
  }

  // ─────────────────────────────────────────────────────────────────────────
  // onEnd - ĐƯỢC GỌI KHI TOÀN BỘ TEST KẾT THÚC
  // ─────────────────────────────────────────────────────────────────────────
  // Tham số:
  //   - result.status: 'passed' | 'failed' | 'timedout' | 'interrupted'
  onEnd(result: FullResult) {
    const duration = formatDuration(Date.now() - this.startTime);
    const total = this.passed + this.failed + this.skipped;
    const rate = total > 0 ? ((this.passed / total) * 100).toFixed(1) : "0";

    // In summary
    console.log(`${c.cyan}${"=".repeat(65)}${c.reset}`);
    console.log(
      `  ${c.bold}TEST RESULTS${c.reset}  ${c.dim}Completed at ${timestamp()}${c.reset}`,
    );
    console.log(`${c.dim}${"─".repeat(65)}${c.reset}`);
    console.log(`  [${progressBar(this.passed, this.failed, total)}] ${rate}%`);
    console.log("");
    console.log(
      `  ${c.green}Passed:${c.reset}  ${this.passed}    ${c.red}Failed:${c.reset}  ${this.failed}    ${c.yellow}Skipped:${c.reset} ${this.skipped}`,
    );
    console.log(
      `  ${c.gray}Duration:${c.reset} ${c.bold}${duration}${c.reset}`,
    );
    console.log(`${c.cyan}${"=".repeat(65)}${c.reset}`);

    // Liệt kê các test fail
    if (this.failures.length > 0) {
      console.log("");
      console.log(`${c.red}${c.bold}FAILED TESTS:${c.reset}`);
      this.failures.forEach((t, i) => {
        console.log(`  ${c.red}${i + 1}. ${t.title}${c.reset}`);
        console.log(
          `     ${c.dim}${t.error.substring(0, 80)}${t.error.length > 80 ? "..." : ""}${c.reset}`,
        );
      });
    }

    // Liệt kê các lỗi toàn cục
    if (this.globalErrors.length > 0) {
      console.log("");
      console.log(`${c.red}${c.bold}GLOBAL ERRORS:${c.reset}`);
      this.globalErrors.forEach((err, i) => {
        console.log(`  ${c.red}${i + 1}. ${err}${c.reset}`);
      });
    }

    // Banner kết quả cuối cùng
    console.log("");
    if (result.status === "passed") {
      console.log(
        `${c.bgGreen}${c.bold}${c.white}  ALL TESTS PASSED  ${c.reset}`,
      );
    } else if (result.status === "timedout") {
      console.log(`${c.bgYellow}${c.bold}  TIMED OUT  ${c.reset}`);
    } else {
      console.log(
        `${c.bgRed}${c.bold}${c.white}  SOME TESTS FAILED  ${c.reset}`,
      );
    }
    console.log("");
  }

  // ─────────────────────────────────────────────────────────────────────────
  // onExit - ĐƯỢC GỌI NGAY TRƯỚC KHI PLAYWRIGHT THOÁT
  // ─────────────────────────────────────────────────────────────────────────
  // Đây là cơ hội cuối cùng để:
  //   - Upload report lên server
  //   - Gửi thông báo Slack/Teams
  //   - Cleanup temp files
  //   - Ghi log vào database
  async onExit() {
    console.log(`${c.dim}Reporter cleanup complete.${c.reset}`);
  }

  // ─────────────────────────────────────────────────────────────────────────
  // printsToStdio - BÁO PLAYWRIGHT RẰNG REPORTER NÀY GHI RA CONSOLE
  // ─────────────────────────────────────────────────────────────────────────
  // Nếu return true, Playwright biết không cần ghi thêm output mặc định
  // Giúp tránh conflict với các built-in reporters
  printsToStdio(): boolean {
    return true;
  }
}

// Export class để Playwright có thể sử dụng
export default CustomReporter;
