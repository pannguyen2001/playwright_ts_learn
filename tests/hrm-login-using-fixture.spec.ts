// ─── Import from YOUR fixture, not from "@playwright/test" directly ──────────
//
// This single import gives you:
//   - `test`   → Playwright's test() with your fixtures injected
//   - `expect` → Playwright's expect (re-exported from the fixture)
//
import { test, expect } from "@/fixtures/login.fixture";

import { BASE_URL, PROJECT_NAME, OWNER } from "@/configs/constants";
import { setMetadata } from "@/utils/allure.helpers";
import { LoginTestCase } from "@/types/testcase.type";
import {
	negativeLoginTestCases,
	positiveLoginTestCases,
} from "@/testCases/login.testcase";
import { TestMetadata } from "@/types/common.type";
import logger from "@/utils/log4js";

// import { createLogger } from "@/utils/logger";
import { createLogger } from "@/utils/log4js";

const log = createLogger("LoginSpec");

const LOGIN_URL = `${BASE_URL}/erp/login`;

const loginMetaData: TestMetadata = {
	projectName: PROJECT_NAME,
	description: "Test login page",
	feature: ["UI"],
	page: "LOGIN",
	owner: OWNER,
};

// Delete all files in videos, screenshots, test-results before running new test
import { readdir, unlink } from "node:fs/promises";
import path from "node:path";

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

test.describe(`${loginMetaData.description} - POSITIVE`, () => {
	// ─── beforeAll: folder cleanup ──────────────────────────────────────────────
	// This stays the same — it's not fixture territory (no page/browser needed).
	test.beforeAll(async () => {
		await clearFolder("./videos");
		await clearFolder("./screenshots");
	});

	positiveLoginTestCases.forEach((testCase: LoginTestCase, index: number) => {
		test(
			testCase.testName,
			async ({
				// ── Destructure your fixtures ──────────────────────────────────────────
				//
				// Playwright reads these parameter names and matches them to the fixture
				// definitions in login.fixture.ts. No manual instantiation needed.
				//
				loginPage, // ← LoginPage POM, already constructed with an isolated page
				toast, // ← ToastComponent, already constructed
				goToLogin, // ← async function () => loginPage.goto(BASE_URL)
				browserName, // ← built-in Playwright fixture (string: "chromium" | "firefox" | "webkit")
			}) => {
				// ── Arrange ─────────────────────────────────────────────────────────────
				//
				// setMetadata is still a plain helper call — not fixture territory.
				setMetadata(loginMetaData, testCase, index);
				log.info(`Starting test: "${testCase.testName}" - "${browserName}"`);

				// goToLogin is the fixture function we defined. Calling it navigates to BASE_URL.
				// This replaces: await loginPage.goto(BASE_URL)
				await goToLogin();

				// ── Browser filter ───────────────────────────────────────────────────────
				//
				// test.skip() with a condition: if this test isn't meant for this browser, skip it.
				// Must be called BEFORE any Act/Assert so Playwright registers the skip early.
				//
				const shouldRun =
					testCase.isAllBrowser || testCase.browserName?.includes(browserName);
				test.skip(
					!shouldRun,
					`Skipping "${testCase.testName}" on ${browserName}`,
				);

				// ── Act ──────────────────────────────────────────────────────────────────
				await loginPage.login(testCase.username, testCase.password);

				// ── Assert ───────────────────────────────────────────────────────────────
				if (testCase.expectedResult?.url) {
					await loginPage.expectUrl(testCase.expectedResult.url);
				}

				if (testCase.additionalAction === "logout") {
					await loginPage.logout();
					await loginPage.expectUrl(LOGIN_URL);
				}

				if (testCase.expectedResult?.toast) {
					await toast.assertMessage(testCase.expectedResult.toast);
				}

				log.info(`Test passed: "${testCase.testName}" - "${browserName}"`);

				// ── No manual context.close() needed ─────────────────────────────────────
				// The `isolatedPage` fixture teardown handles it automatically after `use()`.
			},
		);
	});
});
