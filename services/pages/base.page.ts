import { type Page, type Locator, expect } from "@playwright/test";
import { BASE_URL, timestamp } from "@/configs/constants";

// import { createLogger } from "@/utils/logger";
import { createLogger } from "@/utils/log4js";

const log = createLogger("LoginPage");

export abstract class BasePage {
	readonly browserName: string;
	readonly testcaseName: string;
	readonly page: Page;
	readonly url: string;
	readonly userMenu: Locator;
	readonly logoutBtn: Locator;

	constructor(page: Page, browserName: string, testcaseName: string) {
		this.page = page;
		this.browserName = browserName;
		this.testcaseName = testcaseName;
		// this.userMenu = page.getByRole('button', { name: 'Test Employee admin_example' });
		this.logoutBtn = page.getByRole("link", { name: " Logout" });
	}

	async goto(url: string) {
		await this.page.goto(url);
	}

	async close() {
		await this.page.close();
	}

	async reload() {
		await this.page.reload();
	}
	async screenshot(name: string) {
		await this.page.screenshot({
			path: `./screenshots/${timestamp()}_${name}.png`,
		});
	}

	async reocordVideo(name: string) {
		await this.page.video().saveAs(`./videos/${timestamp()}_${name}.webm`);
	}
	async waitForSelector(selector: string) {
		await this.page.waitForSelector(selector);
	}

	async waitForTimeout(timeout: number) {
		await this.page.waitForTimeout(timeout);
	}

	async logout() {
		// log.step("Logging out");
		// await this.userMenu.click();
		await this.logoutBtn.click();
		log.info(`[${this.browserName}][${this.testcaseName}] Logout complete`);
	}
}
