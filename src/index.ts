import { parseEnv } from "./lib/parser";
import { TsEnv } from "./lib/ts-env";

const env = parseEnv();

TsEnv.generateTypes(env);

console.log("Type definition file generated at src/types.d.ts");