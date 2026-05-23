import {type Page, type Locator, expect } from '@playwright/test';
import { BASE_URL, timestamp } from '@/configs/constants';

export abstract class BasePage {
  readonly page: Page;
  readonly url: string;
  readonly userMenu: Locator;
  readonly logoutBtn: Locator;

  constructor(page: Page) {
    this.page = page;
    // this.userMenu = page.getByRole('button', { name: 'Test Employee admin_example' });
    this.logoutBtn = page.getByRole('link', { name: ' Logout' });
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
    await this.page.screenshot({ path: `./screenshots/${timestamp()}_${name}.png` });
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
    // await this.userMenu.click();
    await this.logoutBtn.click();
  }
}