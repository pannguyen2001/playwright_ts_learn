import { BASE_URL, DASHBOARD_URL, PASSWORD, USER_NAME } from "@/configs/constants";
import { LoginTestCase } from "@/types/testcase.type";

// Should isolate positive case and negative case
export const positiveLoginTestCases: LoginTestCase[] = [
    {
        testName: "Login with correct user name and password",
        description: "Successful login with valid credentials",
        username: USER_NAME,
        password: PASSWORD,
        priority: "CRITICAL",
        isAllBrowser: true,
        testCaseType:"POSITIVE",
        expectedResult: {
            url: BASE_URL,
        },
    },
    {
        testName: "Logout successfully",
        description: "User can logout and return to login page",
        username: USER_NAME,
        password: PASSWORD,
        priority: "CRITICAL",
        isAllBrowser: true,
        additionalAction: "logout",
        testCaseType:"POSITIVE",
        expectedResult: {
            url: BASE_URL,
        },
    }
];

export const negativeLoginTestCases: LoginTestCase[] = [
    {
        testName: "Login with incorrect user name",
        description: "Login fails with invalid username",
        username: "abc",
        password: PASSWORD,
        priority: "CRITICAL",
        isAllBrowser: true,
        testCaseType: "NEGATIVE",
        expectedResult: {
            url: "https://hrm.anhtester.com",
            toast: "Invalid Login Credentials."
        },
    },
    {
        testName: "Login with incorrect password",
        description: "Login fails with invalid password",
        username: USER_NAME,
        password: "abcdefghi",
        priority: "CRITICAL",
        isAllBrowser: true,
        testCaseType: "NEGATIVE",
        expectedResult: {
            url: "https://hrm.anhtester.com",
            toast: "Invalid Login Credentials."
        },
    },
    {
        testName: "Login with password does not meet min length.",
        description: "Login fails with password length less than 6 characters.",
        username: USER_NAME,
        password: "abc",
        priority: "CRITICAL",
        isAllBrowser: true,
        testCaseType: "NEGATIVE",
        expectedResult: {
            url: "https://hrm.anhtester.com",
            toast: "Your password is too short, minimum 6 characters required.",
        },
    },
    {
        testName: "Login with empty user name",
        description: "Login fails when username is empty",
        username: "",
        password: PASSWORD,
        priority: "CRITICAL",
        isAllBrowser: true,
        testCaseType: "NEGATIVE",
        expectedResult: {
            url: "https://hrm.anhtester.com",
            toast: "The username field is required."
        },
    },
    {
        testName: "Login with empty password",
        description: "Login fails when password is empty",
        username: USER_NAME,
        password: "",
        priority: "CRITICAL",
        isAllBrowser: true,
        testCaseType: "NEGATIVE",
        expectedResult: {
            url: "https://hrm.anhtester.com",
            toast: "The password field is required."
        }
    },
    {
        testName: "Login with empty user name and password",
        description: "Login fails when both fields are empty",
        username: "",
        password: "",
        priority: "CRITICAL",
        isAllBrowser: true,
        testCaseType: "NEGATIVE",
        expectedResult: {
            url: "https://hrm.anhtester.com",
            toast: "The username field is required."
        }
    },
    {
        testName: "Login with both incorrect user name and password",
        description: "Login fails with completely invalid credentials",
        username: "abcdef123",
        password: "abcdef",
        priority: "CRITICAL",
        isAllBrowser: true,
        testCaseType: "NEGATIVE",
        expectedResult: {
            url: "https://hrm.anhtester.com",
            toast: "Invalid Login Credentials."
        }
    },
];