import { TsEnv, type TsEnvOptions } from "./lib/ts-env";

/**
 * Creates a new instance of TsEnv.
 *
 * @param options - Configuration options for TsEnv.
 * @returns A new TsEnv instance.
 */
function createEnv(options?: TsEnvOptions): TsEnv {
	return new TsEnv(options);
}

export { TsEnv, type TsEnvOptions, createEnv };
export default createEnv;
