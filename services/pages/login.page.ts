// src/services/pages/login.page.ts
import { type Page, type Locator, expect, TestInfo } from "@playwright/test";
import logger from "@/utils/log4js";
import { BasePage } from "@/services/pages/base.page";

// import { createLogger } from "@/utils/logger";
import { createLogger } from "@/utils/log4js";

const log = createLogger("LoginPage");

export class LoginPage extends BasePage {
	readonly usernameInput: Locator;
	readonly passwordInput: Locator;
	readonly loginButton: Locator;

	constructor(page: Page, testInfo?: TestInfo) {
		super(page, testInfo);
		this.usernameInput = page.getByRole("textbox", { name: "Your Username" });
		// page.locator('input[name="iusername"]'); // Adjust selectors
		this.passwordInput = page.getByRole("textbox", { name: "Enter Password" });
		// page.locator('input[name="password"]');
		this.loginButton = page.getByRole("button", { name: /Login/i }).first();
		// page.locator('button[type="submit"]');
	}

	// Actions
	async fillUsername(username: string): Promise<void> {
		await this.usernameInput.fill(username);
	}

	async fillPassword(password: string): Promise<void> {
		await this.passwordInput.fill(password);
	}

	async clickLogin(): Promise<void> {
		await this.loginButton.click();
	}

	// Compound Actions
	async login(username: string, password: string): Promise<void> {
		// Don't log the actual password — mask it
		log.info(
			`[${this.testInfo?.testId}][${this.testInfo?.project?.name}][${this.testInfo?.title}] Logging in as "${username || "<empty>"}" / "${password ? "***" : "<empty>"}"`,
		);
		await this.fillUsername(username);
		await this.fillPassword(password);
		await this.clickLogin();
	}
}
