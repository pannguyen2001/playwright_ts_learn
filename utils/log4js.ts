/**
 * Log with log4js
 * Source: https://log4js-node.github.io/log4js-node/layouts.html
 * If not need json log to send to FE, using it is the better.
 */
import log4js, { Logger } from "log4js";
import { LOG_FOLDER_PATH, DATE_FORMAT } from "@/configs/constants";
import moment from "moment";
import * as fs from "fs";

const now = moment(new Date()).format(DATE_FORMAT);

const logFolderPath = `${LOG_FOLDER_PATH ?? "logs"}/${now}`;
if (!fs.existsSync(logFolderPath))
	fs.mkdirSync(logFolderPath, { recursive: true });

const worker = process.env.TEST_WORKER_INDEX ?? "0";

const logFileName = `${logFolderPath}/worker-${worker}.log`;

log4js.configure({
	appenders: {
		out: {
			type: "stdout",
			layout: {
				type: "pattern",
				pattern:
					"[\x1b[1m%[%p%]\x1b[0m][\x1b[36m%d{yyyy-MM-dd hh:mm:ss}\x1b[0m][\x1b[35m%f{1}:%M:%l:%o\x1b[0m]%n\x1b[1m%[%m%]\x1b[0m",
			},
		},
		app: {
			type: "file",
			filename: logFileName,
			maxLogSize: 10485760,
			numBackups: 3,
			layout: {
				type: "pattern",
				// pattern: "[%p][%d{yyyy-MM-dd hh:mm:ss}][%f{1}:%M:%l] %m%n",
				pattern: "[%p][%d{yyyy-MM-dd hh:mm:ss}][%f{1}:%M:%l]%n%m",
			},
		},
	},
	categories: {
		default: {
			appenders: ["out", "app"],
			level: "debug",
			enableCallStack: true,
		},
		// app: { appenders: ["app"], level: "trace"},
	},
});

const logger = log4js.getLogger();
export default logger;

/** Factory — each file/class gets its own named logger */
export function createLogger(context: string): Logger {
	return log4js.getLogger(context);
}
