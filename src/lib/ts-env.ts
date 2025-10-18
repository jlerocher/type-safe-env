/** biome-ignore-all lint/complexity/noStaticOnlyClass: <> */
import fs from "node:fs";
import path from "node:path";
import { parseEnv, typesDetector } from "./parser";

/**
 * Options for configuring the TsEnv instance.
 */
export interface TsEnvOptions {
	/**
	 * The directory to search for .env files.
	 * @default process.cwd()
	 */
	dir?: string;
	/**
	 * The path for the generated TypeScript declaration file.
	 * To disable type generation, set this to `null`.
	 * @default path.join(process.cwd(), "src", "types.d.ts")
	 */
	typesPath?: string | null;
	/**
	 * The file encoding for .env files.
	 * @default "utf-8"
	 */
	encoding?: BufferEncoding;
	/**
	 * The environment to load, e.g., 'development' or 'production'.
	 * This determines which `.env.[env]` file to load.
	 * @default process.env.NODE_ENV
	 */
	env?: string;
}

/**
 * Manages environment variables with type-safety.
 *
 * This class loads variables from .env files, infers their types,
 * validates them, and generates a corresponding TypeScript declaration file.
 */
export class TsEnv {
	private readonly rawEnv: Record<string, string>;
	private readonly env: Record<string, string | number | boolean>;

	/**
	 * Creates an instance of TsEnv.
	 *
	 * During instantiation, it performs the following steps:
	 * 1. Finds and loads `.env` and `.env.[NODE_ENV]` files.
	 * 2. Parses the variables from these files.
	 * 3. Validates that all variables are defined and not empty.
	 * 4. Infers the types (string, number, boolean) of the variables.
	 * 5. Generates a `types.d.ts` file with an `Env` type.
	 *
	 * @param options - Configuration for file paths and environment.
	 */
	constructor(options: TsEnvOptions = {}) {
		const dir = options.dir ?? process.cwd();
		const env = options.env ?? process.env.NODE_ENV;
		const encoding = options.encoding ?? "utf-8";
		const typesPath =
			options.typesPath === undefined
				? path.join(process.cwd(), "src", "types.d.ts")
				: options.typesPath;

		this.rawEnv = this.load(dir, env);
		this.validate();
		this.env = this.parse();

		if (typesPath) {
			this.generateTypes(typesPath, encoding);
		}
	}

	/**
	 * Loads variables from .env files into a raw object.
	 * @param dir - The directory to search in.
	 * @param env - The current environment (e.g., 'production').
	 * @returns A record of raw string values from the .env files.
	 */
	private load(dir: string, env?: string): Record<string, string> {
		const files = [".env"];
		if (env) {
			files.push(`.env.${env}`);
		}

		return files
			.map((file) => path.join(dir, file))
			.filter(fs.existsSync)
			.map((filePath) => parseEnv(filePath))
			.reduce((acc, current) => {
				for (const key in current) {
					acc[key] = current[key] ?? "";
				}
				return acc;
			}, {});
	}

	/**
	 * Validates that all loaded environment variables have non-empty values.
	 * @throws {Error} If any variable is empty.
	 */
	private validate(): void {
		for (const key in this.rawEnv) {
			if (
				this.rawEnv[key] === null ||
				this.rawEnv[key] === undefined ||
				this.rawEnv[key].trim() === ""
			) {
				throw new Error(`Environment variable "${key}" must not be empty.`);
			}
		}
	}

	/**
	 * Parses the raw environment variables into their inferred types.
	 * @returns A record of type-converted values.
	 */
	private parse(): Record<string, string | number | boolean> {
		const typedEnv: Record<string, string | number | boolean> = {};
		const types = typesDetector(this.rawEnv);

		for (const key in this.rawEnv) {
			const originalValue = this.rawEnv[key];
			const type = types[key];
			const value = originalValue?.replace(/^['"]|['"]$/g, "") ?? "";

			if (type === "boolean") {
				typedEnv[key] = value.toLowerCase() === "true";
			} else if (type === "number") {
				typedEnv[key] = Number(value);
			} else {
				typedEnv[key] = value;
			}
		}
		return typedEnv;
	}

	/**
	 * Generates the `types.d.ts` file.
	 * @param typesPath - The path to write the file to.
	 * @param encoding - The file encoding.
	 */
	private generateTypes(typesPath: string, encoding: BufferEncoding): void {
		const types = typesDetector(this.rawEnv);
		let typeString = "declare type Env = {\n";
		for (const key in types) {
			typeString += `    readonly ${key}: ${types[key]};
`;
		}
		typeString += "};\n";

		fs.writeFileSync(typesPath, typeString, encoding);
	}

	/**
	 * Gets the typed value of an environment variable.
	 *
	 * @param key - The name of the environment variable.
	 * @returns The typed value.
	 */
	public get(key: string): string | number | boolean | undefined {
		return this.env[key];
	}
}
