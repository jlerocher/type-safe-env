import { TsEnv } from "./lib/ts-env";

const tsEnv = new TsEnv();
console.log(tsEnv.get("API_PORT"));
