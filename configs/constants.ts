import moment from "moment-timezone";
const { loadEnvFile } = require("node:process");

// Loads environment variables from the default .env file
loadEnvFile();

const BASE_URL: string = process.env.BASE_URL ?? "http://localhost:3000";
const USER_NAME: string = process.env.USER_NAME ?? "";
const PASSWORD: string = process.env.PASSWORD ?? "";
const DASHBOARD_URL: string = `${BASE_URL}/erp/desk?module=dashboard`;
const LOG_FOLDER_PATH: string = process.env.LOG_FOLDER_PATH ?? "./logs";
const DATE_TIME_FORMAT: string = "YYYY-MM-DD HH:mm:ss";
const DATE_FORMAT: string = "YYYY-MM-DD";
const PROJECT_NAME: string = process.env.PROJECT_NAME ?? "defaultProject";
const OWNER: string = process.env.OWNER ?? "defaultOwner";

enum PriorityEnum {
	CRITICAL = "critical",
	MAJOR = "major",
	NORMAL = "normal",
	MINOR = "minor",
}
type Priority = keyof typeof PriorityEnum;

enum FeatureEnum {
	UI = "UI",
	API = "API",
	FUNCTIONALITY = "FUNCTIONALITY",
	NON_FUNCTIONALITY = "NON_FUNCTIONALITY",
}
type Feature = keyof typeof FeatureEnum;

enum BrowserEnum {
	CHROME = "chrome",
	FIREFOX = "firefox",
	EDGE = "edge",
	WEBKIT = "webkit",
}
type Browser = keyof typeof BrowserEnum;

enum TestPageEnum {
	LOGIN = "login",
	DASHBOARD = "dashboard",
}
type TestPage = keyof typeof TestPageEnum;

enum TestcaseTypeEnum {
	POSITIVE = "positive",
	NEGATIVE = "negative",
}

type TestcaseType = keyof typeof TestcaseTypeEnum;

export {
	BASE_URL,
	USER_NAME,
	PASSWORD,
	DASHBOARD_URL,
	LOG_FOLDER_PATH,
	DATE_FORMAT,
	DATE_TIME_FORMAT,
	PROJECT_NAME,
	OWNER,
	PriorityEnum,
	Priority,
	FeatureEnum,
	Feature,
	BrowserEnum,
	Browser,
	TestPageEnum,
	TestPage,
	TestcaseTypeEnum,
	TestcaseType,
};

export function timestamp(): string {
	return moment
		.tz(new Date(), "Asia/Ho_Chi_Minh")
		.format("YYYY-MM-DD HH-mm-ss");
}
