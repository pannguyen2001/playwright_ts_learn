import { accountFixtures as test, expect } from "@/fixtures/account.fixture"; // adjust path

test("logged-in user can view profile and log out", async ({
	page,
	account,
}) => {
	// This page opens with all your saved auth tokens and cookies already active!

	await page.goto("https://datn-fe-sooty.vercel.app/admin");

	await page.goto(`https://datn-fe-sooty.vercel.app/profile/${account._id}`); // replace by url/profile/userid
	await expect(page.getByRole("link", { name: "Đăng xuất" })).toBeVisible();
	await page.getByRole("link", { name: "Đăng xuất" }).click();
	await expect(page).toHaveURL(/\/login/); // or wherever logout redirects you
	await expect(page.getByRole("link", { name: "Đăng nhập" })).toBeVisible();
});
