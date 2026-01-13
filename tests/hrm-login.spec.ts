import { test, expect, type Page } from "@playwright/test";
import {
  BASE_URL,
  DASHBOARD_URL,
  USER_NAME,
  PASSWORD
} from "../utils/constants";
import { LoginPage } from "../services/pages/login.page";
import { setLoginMetadata } from "../utils/allure.helpers";

let loginPage: LoginPage;

test.describe("Test login page", async () => {

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.goto(BASE_URL);
  });

  test("Login with correct user name and password.", async ({ page }, testInfo) => {
    setLoginMetadata(
      testInfo.title,
      testInfo.project.name,
      "Login with correct user name and password",
      "critical",
      "Login with correct user name and password",
    );
    await loginPage.login(USER_NAME, PASSWORD);
    await expect.soft(page).toHaveURL(DASHBOARD_URL);
  });

  test("Login with incorrect user name.", async ({ page }, testInfo) => {
    setLoginMetadata(
      testInfo.title,
      testInfo.project.name,
      "Login with incorrect user name",
      "critical",
      "Login with incorrect user name",
    );
    await loginPage.login("abc", PASSWORD);
    await expect.soft(page).toHaveURL(BASE_URL);
    const toastMessage = page.locator("div[class=toast-message]");
    await expect.soft(toastMessage).toBeVisible();
    await expect.soft(toastMessage).toHaveText("Invalid Login Credentials.");
  });

  test("Login with incorrect password.", async ({ page }, testInfo) => {
    setLoginMetadata(
      testInfo.title,
      testInfo.project.name,
      "Login with correct user name and incorrect password",
      "critical",
      "Login with correct user name and incorrect password",
    )
    await loginPage.login(USER_NAME, "abc");
    await expect.soft(page).toHaveURL(BASE_URL);
    const toastMessage = page.locator("div[class=toast-message]");
    await expect.soft(toastMessage).toBeVisible();
    await expect.soft(toastMessage).toHaveText("Invalid Login Credentials.");
  });

  test("Login with empty user name.", async ({ page }, testInfo) => {
    setLoginMetadata(
      testInfo.title,
      testInfo.project.name,
      "Login with empty user name",
      "critical",
      "Login with empty user name",
    )
    await loginPage.login("", PASSWORD);
    await expect.soft(page).toHaveURL(BASE_URL);
    const toastMessage = page.locator("div[class=toast-message]");
    await expect.soft(toastMessage).toBeVisible();
    await expect.soft(toastMessage).toHaveText("The username field is required.");
  });


  test("Login with empty password.", async ({ page }, testInfo) => {
    setLoginMetadata(
      testInfo.title,
      testInfo.project.name,
      "Login with empty password",
      "critical",
      "Login with empty password",
    )
    await loginPage.login(USER_NAME, "");
    await expect.soft(page).toHaveURL(BASE_URL);
    const toastMessage = page.locator("div[class=toast-message]");
    await expect.soft(toastMessage).toBeVisible();
    await expect.soft(toastMessage).toHaveText("The password field is required.");
  });

  test("Login with empty user name and password.", async ({ page }, testInfo) => {
    setLoginMetadata(
      testInfo.title,
      testInfo.project.name,
      "Login with empty user name and password",
      "critical",
      "Login with empty user name and password",
    )
    await loginPage.login("", "");
    await expect.soft(page).toHaveURL(BASE_URL);
    const toastMessage = page.locator("div[class=toast-message]");
    await expect.soft(toastMessage).toBeVisible();
    await expect.soft(toastMessage).toHaveText("The username field is required.");
  });

  test("Login with both incorrect user name and password", async ({ page }, testInfo) => {
    setLoginMetadata(
      testInfo.title,
      testInfo.project.name,
      "Login with both incorrect user name and password",
      "critical",
      "Login with both incorrect user name and password",
    )
    await loginPage.login("abc", "abc");
    await expect.soft(page).toHaveURL(BASE_URL);
    const toastMessage = page.locator("div[class=toast-message]");
    await expect.soft(toastMessage).toBeVisible();
    await expect.soft(toastMessage).toHaveText("Invalid Login Credentials.");
  });
});
