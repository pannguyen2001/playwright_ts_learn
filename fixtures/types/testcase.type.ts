import { Priority } from "@/configs/constants";


export interface CommonTestCase {
  testId?: string | "unknown"; // unique id for the test case
  testName: string;
  description: string;
  priority: Priority;
  expectedResult?: any;
  isAllBrowser?: boolean; // if this field id false, browserName needs to be filled
  browserName?: string[];
  additionalAction?: string | string[];
  testCaseType: "POSITIVE" | "NEGATIVE";
  username?: string;
  password?: string;
}

export interface LoginTestCase extends CommonTestCase {
  // expectedUrl?: string;
  // expectedToast?: string; // expected toast message
  expectedResult?: {
    url?: string;
    toast?: string;
  }
}