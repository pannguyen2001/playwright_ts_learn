// ─── Core imports ────────────────────────────────────────────────────────────
import {
	test as base,
	expect,
	type Page,
	type BrowserContext,
} from "@playwright/test";
//      ↑ "base" = the original Playwright `test` object.
//        We extend it, not replace it. Renaming to "base" is the standard convention.

import { LoginPage } from "@/services/pages/login.page";
import ToastComponent from "@/services/components/toast.component";
import { BASE_URL, BrowserEnum } from "@/configs/constants";

// ─── 1. Define the shape of your custom fixtures ─────────────────────────────
//
// This is a plain TypeScript interface. It tells Playwright (and your IDE)
// what new properties will be available inside test({ page, ... }).
//
// Think of it as the "contract" for your fixture.
//
export interface LoginFixtures {
	isolatedPage: Page; // A fresh page with cleared state (replaces your manual setup)
	loginPage: LoginPage; // POM instance, ready to use
	toast: ToastComponent; // Toast POM, ready to use
	goToLogin: () => Promise<void>; // A pre-built "navigate to login" action
}

// ─── 2. Extend the base test with your fixtures ───────────────────────────────
//
// `base.extend<LoginFixtures>({...})` returns a NEW `test` function
// that has all of Playwright's built-ins PLUS your custom fixtures.
//
// Export this as `test` so your spec file can import it as a drop-in replacement.
//
export const test = base.extend<LoginFixtures>({
	// ─── Fixture: isolatedPage ──────────────────────────────────────────────────
	//
	// This replaces everything you currently do manually inside each test:
	//   browser.newContext() / page / clearCookies / clearPermissions / addInitScript / context.close()
	//
	// Fixture function signature: async ({ browser, browserName }, use) => { ... }
	//   - First arg is destructured from Playwright's built-in fixtures (browser, browserName, page, etc.)
	//   - `use` is a special callback — everything BEFORE `use(value)` is setup (beforeEach),
	//     everything AFTER `use(value)` is teardown (afterEach). Playwright calls it automatically.
	//
	isolatedPage: async ({ browser, browserName }, use) => {
		// ── SETUP (runs before each test that uses this fixture) ─────────────────

		// Create a brand-new browser context (like an incognito window).
		// This is exactly what you had in your test body — now it lives here once.
		const context: BrowserContext = await browser.newContext();

		// Open a new page inside that context.
		const page: Page = await context.newPage();

		// Clear any cookies that might have leaked from a previous run.
		// (Contexts are fresh, but clearCookies is an extra safety net.)
		await context.clearCookies();

		// Clear browser permissions (geolocation, notifications, etc.) for isolation.
		await context.clearPermissions();

		// addInitScript runs in the browser BEFORE any page script executes.
		// We use it to wipe localStorage and sessionStorage so no auth tokens survive.
		// This is important: you can't call localStorage.clear() after the page loads
		// because the app may have already read cached tokens by then.
		await page.addInitScript(() => {
			window.localStorage.clear();
			window.sessionStorage.clear();
		});

		// ── HAND OFF to the test ─────────────────────────────────────────────────
		//
		// `use(page)` is the magic line:
		//   - It gives the `page` object to the test body.
		//   - Playwright PAUSES here while the test runs.
		//   - When the test finishes (pass or fail), execution resumes AFTER this line.
		//
		await use(page);

		// ── TEARDOWN (runs after each test, even if it failed) ───────────────────
		//
		// You had: if (browserName === "chromium") { await context.close(); }
		// With fixtures, Playwright handles cleanup automatically after `use()`.
		// We close the context unconditionally — fixtures are more stable than
		// calling close() manually inside a test body.
		//
		// Why was your original code chromium-only? Firefox/WebKit can have
		// race conditions when closing context manually mid-test.
		// Here it's safe because Playwright has already torn down the test.
		//
		await context.close();
	},

	// ─── Fixture: loginPage ────────────────────────────────────────────────────
	//
	// Depends on `isolatedPage` (our custom fixture above).
	// Playwright resolves fixture dependencies automatically — if loginPage
	// needs isolatedPage, it will set up isolatedPage first.
	//
	// Note: you don't need explicit setup/teardown here.
	// The POM object has no resources to clean up (it's just a wrapper).
	// So we call `use(...)` immediately — no code after it.
	//
	loginPage: async ({ isolatedPage, browserName }, use) => {
		await use(new LoginPage(isolatedPage, browserName));
		//         ↑ Pass the fresh isolated page into the POM constructor.
		//           This is the same as: const loginPage = new LoginPage(page)
		//           but it's now available as a fixture parameter in every test.
	},

	// ─── Fixture: toast ────────────────────────────────────────────────────────
	//
	// Same pattern as loginPage — depends on isolatedPage, no teardown needed.
	//
	toast: async ({ isolatedPage, browserName }, use) => {
		await use(new ToastComponent(isolatedPage));
	},

	// ─── Fixture: goToLogin ────────────────────────────────────────────────────
	//
	// A pre-built action fixture — returns a function the test can call.
	// This replaces: await loginPage.goto(BASE_URL) that you called in every test.
	//
	// Why a fixture instead of a helper function?
	//   - It has access to other fixtures (loginPage) automatically via DI.
	//   - No need to pass `loginPage` as a parameter to a standalone function.
	//
	goToLogin: async ({ loginPage }, use) => {
		//                 ↑ Depends on loginPage fixture (which depends on isolatedPage).
		//                   Playwright resolves the whole chain for you.

		// `use` receives a function (not a value like the others).
		// The test calls this function when it's ready to navigate.
		await use(async () => {
			await loginPage.goto(BASE_URL);
		});

		// No teardown needed — navigation has no cleanup.
	},
});

// ─── 3. Re-export `expect` ────────────────────────────────────────────────────
//
// Best practice: always re-export `expect` from your fixture file.
// This way your spec file only imports from one place:
//   import { test, expect } from "@/fixtures/login.fixture";
// instead of mixing imports from "@playwright/test" and your fixture.
//
export { expect };
