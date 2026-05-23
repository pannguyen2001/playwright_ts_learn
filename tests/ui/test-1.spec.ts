// // using Record new of Playwright extension in VScode

// import { test, expect } from '@playwright/test';

// test('test', async ({ page }) => {
//   await page.goto('https://hrm.anhtester.com/');
//   await page.getByRole('textbox', { name: 'Your Username' }).click();
//   await page.getByRole('textbox', { name: 'Your Username' }).fill('admin_example');
//   await page.getByRole('textbox', { name: 'Enter Password' }).click();
//   await page.getByRole('textbox', { name: 'Enter Password' }).fill('123456');
//   await page.getByRole('button', { name: ' Login' }).click();
//   await page.getByRole('button', { name: 'Test Employee admin_example' }).click();
//   await page.getByRole('link', { name: 'Logout', exact: true }).click();
//   await page.getByRole('textbox', { name: 'Your Username' }).click();
//   await page.getByRole('textbox', { name: 'Your Username' }).fill('admin_example');
//   await page.getByRole('textbox', { name: 'Enter Password' }).click();
//   await page.getByRole('textbox', { name: 'Enter Password' }).fill('123456');
//   await page.getByRole('button', { name: ' Login' }).click();
//   await page.getByRole('link', { name: ' Logout' }).click();
// });