/** biome-ignore-all lint/complexity/noStaticOnlyClass: <> */
import fs from "node:fs";
import path from "node:path";

export class TsEnv {
	public static generateTypes(
		env: Record<string, string>,
		filePath: string = path.join(process.cwd(), "src", "types.d.ts"),
	) {
		let typeString = "export type Env = {\n";
		for (const key in env) {
			typeString += `  ${key}: string;\n`;
		}
		typeString += "};\n";

		fs.writeFileSync(filePath, typeString, "utf-8");
	}
}
