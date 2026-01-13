import {type Page, type Locator } from '@playwright/test';

export abstract class BasePage {
  readonly page: Page;
  readonly url: string;
  readonly userMenu: Locator;
  readonly logoutBtn: Locator;

  constructor(page: Page) {
    this.page = page;
    this.userMenu = page.locator('button[aria-label="User Menu"]');
    this.logoutBtn =  page.locator('a[href="/logout"]');
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
    await this.page.screenshot({ path: `./screenshots/${name}.png` });
  }

  async reocordVideo(name: string) {
    await this.page.video().saveAs(`./videos/${name}.webm`);
  }
  async waitForSelector(selector: string) {
    await this.page.waitForSelector(selector);
  }

  async waitForTimeout(timeout: number) {
    await this.page.waitForTimeout(timeout);
  }

  async logout() {
    await this.userMenu.click();
    await this.logoutBtn.click();
  }
}