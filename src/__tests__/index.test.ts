import { expect, test, describe, beforeEach, afterEach } from "bun:test";
import fs from "node:fs";
import path from "node:path";
import createEnv, { TsEnv } from "../index";
import type { TsEnvOptions } from "../index";

const tempDir = path.join(__dirname, "temp-env-index");

describe("Library entry point", () => {
    beforeEach(() => {
        fs.mkdirSync(tempDir, { recursive: true });
    });

    afterEach(() => {
        fs.rmSync(tempDir, { recursive: true, force: true });
    });

    test("should export TsEnv class", () => {
        expect(TsEnv).toBeDefined();
    });

    test("should export TsEnvOptions type (runtime check)", () => {
        const options: TsEnvOptions = { dir: tempDir };
        expect(options.dir).toBe(tempDir);
    });

    test("should export createEnv function", () => {
        expect(createEnv).toBeInstanceOf(Function);
    });

    test("createEnv should return an instance of TsEnv", () => {
        fs.writeFileSync(path.join(tempDir, ".env"), "VAR1=value");
        const env = createEnv({ dir: tempDir, typesPath: null });
        expect(env).toBeInstanceOf(TsEnv);
        expect(env.get("VAR1")).toBe("value");
    });

    test("default export should be createEnv", () => {
        fs.writeFileSync(path.join(tempDir, ".env"), "VAR1=default");
        const env = createEnv({ dir: tempDir, typesPath: null });
        expect(env.get("VAR1")).toBe("default");
    });
});
