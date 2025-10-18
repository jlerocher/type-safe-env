import { parseEnv, typesDetector } from "./lib/parser";

const env = parseEnv();

const envWithTypes = typesDetector(env);

console.log(envWithTypes);
