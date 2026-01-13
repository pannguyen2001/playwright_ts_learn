const { loadEnvFile } = require('node:process');
// Loads environment variables from the default .env file
loadEnvFile();

const BASE_URL: string = process.env.BASE_URL;
const USER_NAME: string = process.env.USER_NAME;
const PASSWORD: string = process.env.PASSWORD;
const DASHBOARD_URL: string = `${BASE_URL}/erp/desk`;

export {
    BASE_URL,
    USER_NAME,
    PASSWORD,
    DASHBOARD_URL
}