import {
  BASE_URL,
  DASHBOARD_URL,
  USER_NAME,
  PASSWORD
} from "./configs/constants";

console.log(BASE_URL, DASHBOARD_URL, USER_NAME, PASSWORD)

import moment from "moment-timezone";

function timestamp(): string {
  return moment.tz(new Date(), "Asia/Ho_Chi_Minh").format('YYYY-MM-DD HH-mm-ss')
}

console.log(timestamp())
const val = 2
console.log(val.toString().padStart(2, '0'))