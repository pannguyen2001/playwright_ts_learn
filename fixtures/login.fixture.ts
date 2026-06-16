// ─── Core imports ────────────────────────────────────────────────────────────
import { test as base } from "@playwright/test";
import { LoginPage } from "@/services/pages/login.page";
import ToastComponent from "@/services/components/toast.component";
import { BASE_URL } from "@/configs/constants";

export interface LoginFixtures {
	loginPage: LoginPage; // POM instance, ready to use
	toast: ToastComponent; // Toast POM, ready to use
	goToLogin: () => Promise<void>; // A pre-built "navigate to login" action
}

export const loginFixtures = base.extend<LoginFixtures>({
	loginPage: async ({ page }, use, testInfo) => {
		await use(new LoginPage(page, testInfo));
	},

	toast: async ({ page }, use) => {
		await use(new ToastComponent(page));
	},

	goToLogin: async ({ loginPage }, use) => {
		await use(async () => {
			await loginPage.goto(BASE_URL);
		});
	},
});
