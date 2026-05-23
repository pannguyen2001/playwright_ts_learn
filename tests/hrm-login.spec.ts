import { test, expect, type Page } from "@playwright/test";
import {
  BASE_URL,
  DASHBOARD_URL,
  USER_NAME,
  PASSWORD,
} from "@/configs/constants";
import { LoginPage } from "@/services/pages/login.page";
import { setMetadata } from "@/utils/allure.helpers";
import { LoginTestCase } from "@/types/testcase.type";
import { negativeLoginTestCases, positiveLoginTestCases } from "@/testCases/login.testcase";
import ToastComponent from "@/services/components/toast.component";
import { OWNER, PROJECT_NAME } from "@/configs/constants";
import { TestMetadata } from "@/types/common.type";
import logger from "@/utils/log4js";


// let loginPage: LoginPage;
// let toast: ToastComponent;
const LOGIN_URL: string = `${BASE_URL}/erp/login`;
const loginMetaData: TestMetadata = {
  projectName: PROJECT_NAME,
  description: "Test login page",
  feature: ["UI"],
  page: "LOGIN",
  owner: OWNER,
};

// Delete all files in videos, screenshots, test-results before running new test
import { readdir, unlink } from 'node:fs/promises';
import path from 'node:path';

async function clearFolder(directory: string) {
  try {
    const files = await readdir(directory);
    for (const file of files) {
      await unlink(path.join(directory, file));
    }
  } catch (err) {
    console.error('Error clearing folder:', err);
  }
}


test.describe(`${loginMetaData.description} - POSITIVE`, () => {
  // Arrange
  test.beforeAll(async () => {
    // await clearFolder('./test-results');
    await clearFolder('./videos');
    await clearFolder('./screenshots');
  })


  // Data driven test
  positiveLoginTestCases.forEach((testCase: LoginTestCase, index: number) => {
    test(testCase.testName, async ({ browserName, browser }) => {
      // ---------- Arrange ----------
      // Create isolate context browser per test
      const context = await browser.newContext();
      const page = await context.newPage();

      // Clear cookies and storage to isolate state — works on all browsers
      await context.clearCookies();
      await context.clearPermissions();

      // Clear localStorage/sessionStorage via page eval
      await page.addInitScript(() => {
        window.localStorage.clear();
        window.sessionStorage.clear();
      });

      // Set metadata for allure report
      setMetadata(loginMetaData, testCase, index);

      // Create page and component for test
      const loginPage = new LoginPage(page);
      const toast = new ToastComponent(page);
      await loginPage.goto(BASE_URL);


      // ---------- Act ----------
      const shouldRun =
        testCase.isAllBrowser ||
        testCase.browserName?.includes(browserName);

      test.skip(!shouldRun, `Skip for ${browserName}`);

      if (!shouldRun) {
        return;
      }

      await loginPage.login(testCase.username, testCase.password);


      // ---------- Assert -----------
      // Verify Url
      if (testCase.expectedResult?.url) {
        await loginPage.expectUrl(testCase.expectedResult?.url);
      }

      // Logout if exppected
      if (testCase.additionalAction === "logout"){
          await loginPage.logout();
          await loginPage.expectUrl(LOGIN_URL);
      }

      // Verify toast
      if (testCase.expectedResult?.toast) {
        await toast.assertMessage(testCase.expectedResult?.toast);
      }


      // ---------- Clean up ----------
      // Close context
      // Chromium handles close fine; Firefox/WebKit are unstable with it
      if (browserName === "chromium") {
        await context.close();
      }
    });
  })

})


// test.describe.serial(`${loginMetaData.description} - NEGATIVE`, () => {
//   // Arrange
//   test.beforeAll(async () => {
//     // await clearFolder('./test-results');
//     await clearFolder('./videos');
//     await clearFolder('./screenshots');
//   })


//   // Data driven test
//   negativeLoginTestCases.forEach((testCase: LoginTestCase, index: number) => {
//     test(testCase.testName, async ({ browserName, browser }) => {
//       // ---------- Arrange ----------
//       // Create isolate context browser per test
//       const context = await browser.newContext();
//       const page = await context.newPage();

//       // Clear cookies and storage to isolate state — works on all browsers
//       await context.clearCookies();
//       await context.clearPermissions();

//       // Clear localStorage/sessionStorage via page eval
//       await page.addInitScript(() => {
//         window.localStorage.clear();
//         window.sessionStorage.clear();
//       });

//       // Set metadata for allure report
//       setMetadata(loginMetaData, testCase, index);

//       // Create page and component for test
//       const loginPage = new LoginPage(page);
//       const toast = new ToastComponent(page);
//       await loginPage.goto(BASE_URL);


//       // ---------- Act ----------
//       // const shouldRun =
//       //   testCase.isAllBrowser ||
//       //   testCase.browserName?.includes(browserName);

//       // test.skip(!shouldRun, `Skip for ${browserName}`);

//       // if (!shouldRun) {
//       //   return;
//       // }

//       if (testCase.isAllBrowser || (!testCase.isAllBrowser && testCase.browserName?.includes(browserName))) {
//         await loginPage.login(testCase.username, testCase.password);
//       }

//       // await loginPage.login(testCase.username, testCase.password);


//       // ---------- Assert -----------
//       // Verify Url
//       // await test.step(`Verify Url`, async () => {
//       //   await loginPage.expectUrl(testCase.expectedResult?.url ?? BASE_URL);
//       // })
//       if (testCase.expectedResult?.url) {
//         await loginPage.expectUrl(testCase.expectedResult?.url);
//       }

//       // Logout if exppected
//       if (testCase.additionalAction === "logout") {
//         // await test.step(`Logout`, async () => {
//         //   await loginPage.logout();
//         //   await loginPage.expectUrl(LOGIN_URL);
//         // }, {box: true})
//         await loginPage.logout();
//         await loginPage.expectUrl(LOGIN_URL);
//       }

//       // Verify toast
//       if (testCase.expectedResult?.toast) {
//         // await test.step(`Verify Toast`, async () => {
//         //   await toast.assertMessage(testCase.expectedResult?.toast);
//         // }, { box: true })
//         await toast.assertMessage(testCase.expectedResult?.toast);
//       }


//       // ---------- Clean up ----------
//       // Close context
//       // Chromium handles close fine; Firefox/WebKit are unstable with it
//       if (browserName === "chromium") {
//         await context.close();
//       }
//     });
//   })

// })
