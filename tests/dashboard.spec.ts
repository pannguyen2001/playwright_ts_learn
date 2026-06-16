import { test, expect } from "@/fixtures/index";

import { BASE_URL, PROJECT_NAME, OWNER } from "@/configs/constants";
import { setMetadata } from "@/utils/allure.helpers";
import { DashboardTestCase } from "@/types/testcase.type";
import { positiveDasboardTestCases } from "@/testCases/dashboard.testcase";
import { TestMetadata } from "@/types/common.type";
import { readdir, unlink } from "node:fs/promises";
import path from "node:path";
import { createLogger } from "@/utils/log4js";

const METADATA: TestMetadata = {
	projectName: PROJECT_NAME,
	description: "Test login page",
	feature: ["UI"],
	page: "DASHBOARD",
	owner: OWNER,
};

const log = createLogger(METADATA.page);

// Delete all files in videos, screenshots, test-results before running new test

async function clearFolder(directory: string) {
	try {
		const files = await readdir(directory);
		for (const file of files) {
			await unlink(path.join(directory, file));
		}
	} catch (err) {
		console.error("Error clearing folder:", err);
	}
}

test.describe(`${METADATA.description} - POSITIVE`, () => {
	// ─── beforeAll: folder cleanup ──────────────────────────────────────────────
	// This stays the same — it's not fixture territory (no page/browser needed).
	test.beforeAll(async () => {
		await clearFolder("./videos");
		await clearFolder("./screenshots");
	});

	positiveDasboardTestCases.forEach(
		(testCase: DashboardTestCase, index: number) => {
			test(
				testCase.testName,
				async (
					{
						dashboardPage, // ← built-in Playwright fixture (string: "chromium" | "firefox" | "webkit")
					},
					TestInfo,
				) => {
					// ── Arrange ─────────────────────────────────────────────────────────────
					//
					// setMetadata is still a plain helper call — not fixture territory.
					setMetadata(METADATA, testCase, index);
					let testcaseLogInfo: string = `${TestInfo.testId} - ${TestInfo.project.name} - ${testCase.testName}`;
					log.info(`Starting test: ${testcaseLogInfo}`);

					// goToLogin is the fixture function we defined. Calling it navigates to BASE_URL.
					// This replaces: await loginPage.goto(BASE_URL)
					await dashboardPage.goto(BASE_URL);

					await dashboardPage.expectUrl(testCase.expectedResult.url);

					log.info(`Test completed: ${testcaseLogInfo}`);

					// ── No manual context.close() needed ─────────────────────────────────────
					// The `isolatedPage` fixture teardown handles it automatically after `use()`.
				},
			);
		},
	);
});
