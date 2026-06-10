import { test } from "@playwright/test";

type Level = "info" | "warn" | "error" | "debug" | "step";

const ICONS: Record<Level, string> = {
	info: "ℹ",
	warn: "⚠",
	error: "✖",
	debug: "◌",
	step: "→",
};

function timestamp(): string {
	return new Date().toISOString().substring(11, 23); // HH:mm:ss.mmm
}

function formatMessage(level: Level, context: string, message: string): string {
	return `[${timestamp()}] ${ICONS[level]} [${level.toUpperCase()}] [${context}] ${message}`;
}

class Logger {
	constructor(private readonly context: string) {}

	info(message: string, data?: unknown): void {
		this.log("info", message, data);
	}

	warn(message: string, data?: unknown): void {
		this.log("warn", message, data);
	}

	error(message: string, data?: unknown): void {
		this.log("error", message, data);
	}

	debug(message: string, data?: unknown): void {
		if (process.env.LOG_LEVEL === "debug") {
			this.log("debug", message, data);
		}
	}

	/** Attaches log to Allure report as a named step */
	step(message: string, data?: unknown): void {
		this.log("step", message, data);
		// Attach to Playwright test info (shows in HTML reporter too)
		try {
			test.info().annotations.push({ type: "step", description: message });
		} catch {
			// Outside test context (e.g. global setup) — skip silently
		}
	}

	/** Attach arbitrary data as an Allure attachment */
	attach(name: string, body: string, contentType = "text/plain"): void {
		try {
			test.info().attach(name, { body: Buffer.from(body), contentType });
		} catch {
			console.log(`[ATTACH] ${name}: ${body}`);
		}
	}

	private log(level: Level, message: string, data?: unknown): void {
		const formatted = formatMessage(level, this.context, message);
		const consoleFn =
			level === "error"
				? console.error
				: level === "warn"
					? console.warn
					: console.log;

		if (data !== undefined) {
			consoleFn(
				formatted,
				typeof data === "object" ? JSON.stringify(data, null, 2) : data,
			);
		} else {
			consoleFn(formatted);
		}
	}
}

/** Factory — each file/class gets its own named logger */
export function createLogger(context: string): Logger {
	return new Logger(context);
}
