import { test as baseTest, expect, request } from "@playwright/test";
import fs from "fs";
import path from "path";
import authData from "../playwright/.auth/user.json";
import { BASE_URL } from "@/configs/constants";

export * from "@playwright/test";

export const authFixtures = baseTest.extend<{}, { workerStorageState: string }>(
	{
		// Use the same storage state for all tests in this worker.
		storageState: ({ workerStorageState }, use) => use(workerStorageState),

		// Authenticate once per worker with a worker-scoped fixture.
		workerStorageState: [
			async ({ browser }, use) => {
				// Use parallelIndex as a unique identifier for each worker.
				const id = authFixtures.info().parallelIndex;
				const fileName = path.resolve(
					authFixtures.info().project.outputDir,
					`.auth/${id}.json`,
				);

				if (fs.existsSync(fileName)) {
					// Reuse existing authentication state if any.
					await use(fileName);
					return;
				}

				// // ------------------- use API to request authentication -------------------
				// // Important: make sure we authenticate in a clean environment by unsetting storage state.
				// const context = await request.newContext({ storageState: undefined });

				// await context.post(BASE_URL, {
				// 	form: authData.admin,
				// });

				// await context.storageState({ path: fileName });
				// await context.dispose();
				// await use(fileName);

				// ------------------- use API to request authentication -------------------
				// // Important: make sure we authenticate in a clean environment by unsetting storage state.
				const context = await browser.newContext({
					storageState: undefined,
				});
				const page = await context.newPage();

				// Acquire a unique account, for example create a new one.
				// Alternatively, you can have a list of precreated accounts for testing.
				// Make sure that accounts are unique, so that multiple team members
				// can run tests at the same time without interference.
				const account = authData.admin;

				// Perform authentication steps. Replace these actions with your own.
				await page.goto(BASE_URL);
				await page
					.getByRole("textbox", { name: "Your Username" })
					.fill(account.username);
				await page
					.getByRole("textbox", { name: "Enter Password" })
					.fill(account.password);
				await page.getByRole("button", { name: /Login/i }).first().click();
				// Wait until the page receives the cookies.
				//
				// Sometimes login flow sets cookies in the process of several redirects.
				// Wait until the page reaches a state where all cookies are set.
				await expect(
					page.getByText(account.username, { exact: true }),
				).toBeVisible();

				// End of authentication steps.

				await context.storageState({ path: fileName });
				await page.close();
				await use(fileName);
				await context.close();
			},
			{ scope: "worker" },
		],
	},
);
