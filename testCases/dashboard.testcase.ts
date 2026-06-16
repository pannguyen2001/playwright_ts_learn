import { DASHBOARD_URL, PASSWORD, USER_NAME } from "@/configs/constants";
import { DashboardTestCase } from "@/types/testcase.type";

// Should isolate positive case and negative case
export const positiveDasboardTestCases: DashboardTestCase[] = [
	{
		testName: "Check login dashboard successfully",
		description: "Login successfully and go to dashboard",
		username: USER_NAME,
		password: PASSWORD,
		priority: "CRITICAL",
		isAllBrowser: true,
		testCaseType: "POSITIVE",
		expectedResult: {
			url: `${DASHBOARD_URL}`,
		},
	},
];
