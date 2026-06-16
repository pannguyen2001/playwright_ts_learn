// src/services/pages/login.page.ts
import { type Page, type Locator, expect, TestInfo } from "@playwright/test";
import logger from "@/utils/log4js";
import { BasePage } from "@/services/pages/base.page";

// import { createLogger } from "@/utils/logger";
import { createLogger } from "@/utils/log4js";

const log = createLogger("DashboardPage");

export class DashboardPage extends BasePage {
	constructor(page: Page, testInfo: TestInfo) {
		super(page, testInfo);
	}
}
