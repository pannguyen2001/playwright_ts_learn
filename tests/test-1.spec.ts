// // using Record new of Playwright extension in VScode

// import { execSync } from "child_process";
// import { test, expect } from "@playwright/test";

// test.describe("test", () => {
// 	test.beforeEach(async ({}, testInfo) => {
// 		const result = execSync("python ./data_generation/main.py", {
// 			encoding: "utf-8",
// 		});

// 		const user = JSON.parse(result);

// 		testInfo.annotations.push({
// 			type: "user",
// 			description: JSON.stringify(user),
// 		});

// 		testInfo["user"] = user;
// 	});

// 	test("test", async ({ page }, testInfo) => {
// 		const user = testInfo["user"];

// 		await page.goto("https://hrm.anhtester.com/");
// 		await page.getByRole("textbox", { name: "Your Username" }).click();
// 		await page
// 			.getByRole("textbox", { name: "Your Username" })
// 			.fill(user.username);
// 		await page.getByRole("textbox", { name: "Enter Password" }).click();
// 		await page
// 			.getByRole("textbox", { name: "Enter Password" })
// 			.fill(user.password);
// 		await page.getByRole("button", { name: " Login" }).click();
// 		await page.getByRole("link", { name: " Logout" }).click();
// 	});
// });
