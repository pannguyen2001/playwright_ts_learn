import { BASE_URL, DASHBOARD_URL, USER_NAME, PASSWORD } from "../utils/constants";
export interface LoginTestData {
    title: string;
    username: string;
    password: string;
    expectedUrl: string;
    severity: "critical" | "normal";
    description: string;
  }
  
  export const loginTestCases: LoginTestData[] = [
    {
      title: "Login success with valid credentials",
      username: USER_NAME,
      password: PASSWORD,
      expectedUrl: DASHBOARD_URL,
      severity: "critical",
      description: "Đăng nhập thành công với tài khoản hợp lệ"
    },
    {
      title: "Login failed with invalid credentials",
      username: "abc",
      password: "123",
      expectedUrl: BASE_URL,
      severity: "normal",
      description: "Đăng nhập thất bại với tài khoản sai"
    }
  ];
  