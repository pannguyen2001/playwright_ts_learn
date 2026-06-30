// tests/auth.setup.ts
import { test as setup, expect } from "@playwright/test";
import authInfo from "../playwright/.auth/user.json";
import fs from "fs";

// Define the path where the authentication state will be stored
const authFile =
	"C:\\_My_job\\_Code\\_try_playwright_ts\\playwright\\.auth\\datn_auth.json";

setup("authenticate", async ({ request, browser }) => {
	// // 1. Navigate to your login page
	// await page.goto("https://datn-fe-sooty.vercel.app/login");

	// // 2. Fill out and submit the login form
	// await await page
	// 	.getByRole("textbox", { name: "Email" })
	// 	.fill(authInfo.datn_admin.email);
	// await await page
	// 	.getByRole("textbox", { name: "Mật khẩu" })
	// 	.fill(authInfo.datn_admin.password);
	// await await page.getByRole("button", { name: "Đăng nhập" }).click();

	// // 3. CRITICAL: Wait for the post-login page or URL to fully load.

	// // Alternative option: Wait for a specific post-login UI element instead
	// await expect(
	// 	await page.getByText(
	// 		`Hồ sơ cá nhân của bạn ${authInfo.datn_admin.username}`,
	// 		{
	// 			exact: true,
	// 		},
	// 	),
	// ).toBeVisible();

	// // 4. Save storage state (cookies, localStorage) to disk
	// await page.context().storageState({ path: authFile });
	//

	// Send authentication request. Replace with your own.
	const response = await request.post(
		"https://datn-be-steel.vercel.app/api/auth/login",
		{
			form: {
				email: authInfo.datn_admin.email,
				password: authInfo.datn_admin.password,
			},
		},
	);
	const body = await response.json();

	const context = await browser.newContext();

	await context.addInitScript(
		({ token }) => {
			localStorage.setItem("accessToken", token);
		},
		{ token: body.accessToken },
	);
	const page = await context.newPage();
	await page.goto("https://datn-fe-sooty.vercel.app");
	fs.writeFileSync(
		"./playwright/.auth/datn_user.json",
		JSON.stringify(
			{
				...body,
			},
			null,
			2,
		),
	);

	await context.storageState({
		path: authFile,
	});
	// 	await request.storageState({
	//   path: authFile,
	// });
});
