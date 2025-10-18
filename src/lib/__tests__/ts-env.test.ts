import { expect, test, describe, beforeEach, afterEach } from "bun:test";
import fs from "node:fs";
import path from "node:path";
import { TsEnv } from "../ts-env";

const tempDir = path.join(__dirname, "temp-env");
const typesPath = path.join(tempDir, "test-types.d.ts");

describe("TsEnv", () => {
    beforeEach(() => {
        fs.mkdirSync(tempDir, { recursive: true });
    });

    afterEach(() => {
        fs.rmSync(tempDir, { recursive: true, force: true });
    });

    test("should load variables from .env file", () => {
        fs.writeFileSync(path.join(tempDir, ".env"), "VAR1=hello\nVAR2=123");
        const tsEnv = new TsEnv({ dir: tempDir, typesPath: null });
        expect(tsEnv.get("VAR1")).toBe("hello");
        expect(tsEnv.get("VAR2")).toBe(123);
    });

    test("should throw error for empty variables", () => {
        fs.writeFileSync(path.join(tempDir, ".env"), "VAR1=");
        expect(() => new TsEnv({ dir: tempDir, typesPath: null })).toThrow('Environment variable "VAR1" must not be empty.');
    });

    test("should load and override from .env.[env] file", () => {
        fs.writeFileSync(path.join(tempDir, ".env"), "VAR1=base\nVAR2=123");
        fs.writeFileSync(path.join(tempDir, ".env.test"), "VAR1=overridden");
        const tsEnv = new TsEnv({ dir: tempDir, env: "test", typesPath: null });
        expect(tsEnv.get("VAR1")).toBe("overridden");
        expect(tsEnv.get("VAR2")).toBe(123);
    });

    test("should generate types file", () => {
        fs.writeFileSync(path.join(tempDir, ".env"), "STRING=hello\nNUMBER=123\nBOOLEAN=true");
        new TsEnv({ dir: tempDir, typesPath: typesPath });

        expect(fs.existsSync(typesPath)).toBe(true);
        const typesContent = fs.readFileSync(typesPath, "utf-8");
        expect(typesContent).toContain("readonly STRING: string;");
        expect(typesContent).toContain("readonly NUMBER: number;");
        expect(typesContent).toContain("readonly BOOLEAN: boolean;");
    });

    test("should handle quoted values correctly", () => {
        fs.writeFileSync(path.join(tempDir, ".env"), 'VAR1="hello"\nVAR2=\'123\'\nVAR3="true"');
        const tsEnv = new TsEnv({ dir: tempDir, typesPath: null });
        expect(tsEnv.get("VAR1")).toBe("hello");
        expect(tsEnv.get("VAR2")).toBe(123);
        expect(tsEnv.get("VAR3")).toBe(true);
    });

    test("should not generate types if typesPath is null", () => {
        fs.writeFileSync(path.join(tempDir, ".env"), "VAR1=value");
        new TsEnv({ dir: tempDir, typesPath: null });
        expect(fs.existsSync(typesPath)).toBe(false);
    });
});
