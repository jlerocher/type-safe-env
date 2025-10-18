import fs from "node:fs";
import path from "node:path";

/**
 * Parses a .env file and returns an object with the environment variables.
 *
 * @param filePath The path to the .env file. Defaults to ".env" in the current working directory.
 * @returns An object with the environment variables.
 */
export function parseEnv(
	filePath: string = path.join(process.cwd(), ".env"),
): Record<string, string> {
	try {
		const fileContent = fs.readFileSync(filePath, "utf-8");
		const env: Record<string, string> = {};

		fileContent.split("\n").forEach((line) => {
			const trimmedLine = line.trim();
			if (trimmedLine && !trimmedLine.startsWith("#")) {
				const [key, value] = trimmedLine.split("=");
				if (key && value) {
					env[key.trim()] = value.trim();
				}
			}
		});

		return env;
	} catch (error) {
		if ((error as NodeJS.ErrnoException).code === "ENOENT") {
			console.warn(`.env file not found at ${filePath}`);
			return {};
		}
		throw error;
	}
}

export const typesDetector = (
	env: Record<string, string>,
): Record<string, "string" | "number" | "boolean"> => {
	const types: Record<string, "string" | "number" | "boolean"> = {};

	for (const key in env) {
		const value = env[key];
		const processedValue = value ? value.replace(/^['"]|['"]$/g, "") : "";

		if (
			processedValue &&
			(processedValue.toLowerCase() === "true" ||
				processedValue.toLowerCase() === "false")
		) {
			types[key] = "boolean";
		} else if (
			processedValue &&
			processedValue.trim() !== "" &&
			!Number.isNaN(Number(processedValue))
		) {
			types[key] = "number";
		} else {
			types[key] = "string";
		}
	}

	return types;
};
