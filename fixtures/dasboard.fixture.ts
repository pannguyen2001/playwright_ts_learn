// ─── Core imports ────────────────────────────────────────────────────────────
import {
	test as base,
	expect,
	type Page,
	type BrowserContext,
	type TestInfo,
} from "@playwright/test";
import { DashboardPage } from "@/services/pages/dashboard.page";

// ─── 1. Define the shape of your custom fixtures ─────────────────────────────
//
// This is a plain TypeScript interface. It tells Playwright (and your IDE)
// what new properties will be available inside test({ page, ... }).
//
// Think of it as the "contract" for your fixture.
//
export interface DasboardFixtures {
	dashboardPage: DashboardPage;
}

export const dasboardFixtures = base.extend<DasboardFixtures>({
	dashboardPage: async ({ page }, use, testInfo) => {
		await use(new DashboardPage(page, testInfo));
	},
});
