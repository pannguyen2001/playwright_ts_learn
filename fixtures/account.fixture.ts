import { test as baseTest, expect, request } from "@playwright/test";
import fs from "fs";
import path from "path";
import { BASE_URL } from "@/configs/constants";
import logger from "@/utils/log4js";
import authInfo from "../playwright/.auth/user.json";
import { Account } from "@/types/common.type";

export * from "@playwright/test";

export interface AccountFixtures {
	account: Account;
}

export const accountFixtures = baseTest.extend<
	AccountFixtures,
	{ workerStorageState: string }
>({
	storageState: ({ workerStorageState }, use) => use(workerStorageState),
	account: async ({}, use, testInfo) => {
		const id = testInfo.parallelIndex;

		const userFile = path.resolve(
			testInfo.project.outputDir,
			`C:\\_My_job\\_Code\\_try_playwright_ts\\playwright\\.auth\\user-${id}.json`,
		);

		const account = JSON.parse(fs.readFileSync(userFile, "utf-8")) as Account;

		await use(account);
	},
	workerStorageState: [
		async ({ browser }, use, workerInfo) => {
			const id = workerInfo.parallelIndex;
			const fileName = path.resolve(
				workerInfo.project.outputDir,
				`C:\\_My_job\\_Code\\_try_playwright_ts\\playwright\\.auth\\${workerInfo.project.name}-${id}.json`,
			);
			const userFile = path.resolve(
				workerInfo.project.outputDir,
				`C:\\_My_job\\_Code\\_try_playwright_ts\\playwright\\.auth\\user-${id}.json`,
			);

			if (fs.existsSync(fileName) && fs.existsSync(userFile)) {
				await use(fileName);
				return;
			}

			const apiContext = await request.newContext();
			let context;
			try {
				const response = await apiContext.post(
					"https://datn-be-steel.vercel.app/api/auth/login",
					{
						form: {
							email: authInfo.datn_admin.email,
							password: authInfo.datn_admin.password,
						},
					},
				);

				if (!response.ok()) {
					throw new Error(
						`Auth setup failed: ${response.status()} ${await response.text()}`,
					);
				}

				const body = await response.json();
				if (!body.accessToken || !body._id) {
					throw new Error(
						`Auth setup returned incomplete account: ${JSON.stringify(body)}`,
					);
				}

				context = await browser.newContext();
				// await context.addInitScript((token) => {
				// 	localStorage.setItem("accessToken", token);
				// }, body.accessToken);

				const page = await context.newPage();
				await page.goto("https://datn-fe-sooty.vercel.app");
				await page.evaluate((token) => {
					localStorage.setItem("accessToken", token);
				}, body.accessToken);
				await expect(
					await page.getByText(
						`Hồ sơ cá nhân của bạn ${authInfo.datn_admin.username}`,
						{
							exact: true,
						},
					),
				).toBeVisible();
				await page.goto(`https://datn-fe-sooty.vercel.app/profile/${body._id}`);
				await expect(page).toHaveURL(new RegExp(`/profile/${body._id}`));

				fs.mkdirSync(path.dirname(fileName), { recursive: true });
				await context.storageState({ path: fileName });
				fs.writeFileSync(userFile, JSON.stringify({ ...body }, null, 2));
				logger.info(`Auth setup complete for worker ${id}`);
			} catch (err) {
				logger.error(`Auth setup failed for worker ${id}: ${err}`);
				throw err;
			} finally {
				await context?.close();
				await apiContext.dispose();
			}

			await use(fileName);
		},
		{ scope: "worker" },
	],
});
