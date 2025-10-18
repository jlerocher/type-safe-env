import { describe, expect, test } from "bun:test";
import { typesDetector } from "../parser";

describe("typesDetector", () => {
	test("should detect boolean types", () => {
		const env = {
			VAR1: "true",
			VAR2: "false",
			VAR3: "TRUE",
			VAR4: "FALSE",
		};
		const types = typesDetector(env);
		expect(types).toEqual({
			VAR1: "boolean",
			VAR2: "boolean",
			VAR3: "boolean",
			VAR4: "boolean",
		});
	});

	test("should detect number types", () => {
		const env = {
			VAR1: "123",
			VAR2: "3.14",
			VAR3: "0",
			VAR4: "-10",
		};
		const types = typesDetector(env);
		expect(types).toEqual({
			VAR1: "number",
			VAR2: "number",
			VAR3: "number",
			VAR4: "number",
		});
	});

	test("should detect string types for various string values", () => {
		const env = {
			VAR1: "hello world",
			VAR2: "123a",
			VAR3: "true story",
			VAR4: "",
		};
		const types = typesDetector(env);
		expect(types).toEqual({
			VAR1: "string",
			VAR2: "string",
			VAR3: "string",
			VAR4: "string",
		});
	});

	test("should detect string for values with only whitespace", () => {
		const env = {
			VAR1: " ",
			VAR2: "  ",
		};
		const types = typesDetector(env);
		expect(types).toEqual({
			VAR1: "string",
			VAR2: "string",
		});
	});

	test("should handle a mix of types", () => {
		const env = {
			IS_ENABLED: "true",
			COUNT: "42",
			NAME: "Gemini",
			EMPTY: "",
			WHITESPACE: " ",
		};
		const types = typesDetector(env);
		expect(types).toEqual({
			IS_ENABLED: "boolean",
			COUNT: "number",
			NAME: "string",
			EMPTY: "string",
			WHITESPACE: "string",
		});
	});
});

describe("typesDetector with quoted values", () => {
	test("should handle single-quoted values", () => {
		const env = {
			BOOL_TRUE: "'true'",
			BOOL_FALSE: "'false'",
			NUMBER: "'42'",
			STRING: "'hello'",
		};
		const types = typesDetector(env);
		expect(types).toEqual({
			BOOL_TRUE: "boolean",
			BOOL_FALSE: "boolean",
			NUMBER: "number",
			STRING: "string",
		});
	});

	test("should handle double-quoted values", () => {
		const env = {
			BOOL_TRUE: '"true"',
			BOOL_FALSE: '"false"',
			NUMBER: '"-3.14"',
			STRING: '"world"',
		};
		const types = typesDetector(env);
		expect(types).toEqual({
			BOOL_TRUE: "boolean",
			BOOL_FALSE: "boolean",
			NUMBER: "number",
			STRING: "string",
		});
	});

	test("should handle mixed quoted and unquoted values", () => {
		const env = {
			QUOTED_BOOL: "'true'",
			UNQUOTED_BOOL: "false",
			QUOTED_NUM: '"99"',
			UNQUOTED_NUM: "123",
			QUOTED_STR: "'gemini'",
			UNQUOTED_STR: "ai",
		};
		const types = typesDetector(env);
		expect(types).toEqual({
			QUOTED_BOOL: "boolean",
			UNQUOTED_BOOL: "boolean",
			QUOTED_NUM: "number",
			UNQUOTED_NUM: "number",
			QUOTED_STR: "string",
			UNQUOTED_STR: "string",
		});
	});

	test("should not remove internal quotes", () => {
		const env = {
			JSON_STRING: '\'{"key": "value"}\'',
			STRING_WITH_QUOTES: 'hello "world"',
		};
		const types = typesDetector(env);
		expect(types).toEqual({
			JSON_STRING: "string",
			STRING_WITH_QUOTES: "string",
		});
	});
});
