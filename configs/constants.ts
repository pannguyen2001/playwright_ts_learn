
import moment from 'moment-timezone';
const { loadEnvFile } = require("node:process");


// Loads environment variables from the default .env file
loadEnvFile();

const BASE_URL: string | undefined = process.env.BASE_URL;
const USER_NAME: string | undefined = process.env.USER_NAME;
const PASSWORD: string | undefined = process.env.PASSWORD;
const DASHBOARD_URL: string | undefined = `${BASE_URL}/erp/desk`;
const LOG_FOLDER_PATH: string | undefined = process.env.LOG_FOLDER_PATH;
const DATE_TIME_FORMAT: string = "YYYY-MM-DD HH:mm:ss";
const DATE_FORMAT: string = "YYYY-MM-DD";
const PROJECT_NAME: string | undefined = process.env.PROJECT_NAME;
const OWNER: string | undefined = process.env.OWNER;

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
    TestPage
};

export function timestamp(): string {
    return moment.tz(new Date(), "Asia/Ho_Chi_Minh").format('YYYY-MM-DD HH-mm-ss')
}