"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const { equal, isFalse } = require("chai").assert;
const typings_1 = require("../../typings");
const validation_1 = require("../../validation");
const assertErrors = (expr, ...messages) => {
    const result = (0, validation_1.validateFormat)(expr);
    equal(result.length, messages.length, "number of errors");
    result.forEach((error, index) => {
        equal(error.expr, expr);
        equal(error.message, messages[index]);
        isFalse((0, typings_1.isCertLogicExpression)(expr));
    });
};
describe("basic literals", () => {
    it("should recognise valid basic literals", () => {
        assertErrors("");
        assertErrors("foo");
        assertErrors(0);
        assertErrors(42);
        assertErrors(false);
        assertErrors(true);
    });
    it("should recognise invalid basic literals", () => {
        assertErrors(undefined, "invalid CertLogic expression");
        assertErrors(null, "invalid CertLogic expression");
        assertErrors(3.14, "3.14 is a non-integer number");
    });
});
describe("operation objects", () => {
    it("should recognise invalid operation objects", () => {
        assertErrors({}, "expression object must have exactly one key, but it has 0");
        assertErrors({ foo: "bar", alice: "bob" }, "expression object must have exactly one key, but it has 2");
        assertErrors({ all: "foo" }, `operation not of the form { "<operator>": [ <values...> ] }`);
        assertErrors({ all: 42.0 }, `operation not of the form { "<operator>": [ <values...> ] }`);
        assertErrors({ all: true }, `operation not of the form { "<operator>": [ <values...> ] }`);
        assertErrors({ all: false }, `operation not of the form { "<operator>": [ <values...> ] }`);
        assertErrors({ all: undefined }, `operation not of the form { "<operator>": [ <values...> ] }`);
        assertErrors({ all: null }, `operation not of the form { "<operator>": [ <values...> ] }`);
    });
    it("should recognise unknown operators", () => {
        assertErrors({ all: [] }, `unrecognised operator: "all"`);
        assertErrors({ all: [null] }, `unrecognised operator: "all"`);
    });
});
describe("var operations", () => {
    it("should correctly validate var operations", () => {
        assertErrors({ var: undefined }, `not of the form { "var": "<path>" }`);
        assertErrors({ var: 0 }, `not of the form { "var": "<path>" }`);
        assertErrors({ var: "x" });
        assertErrors({ var: "x.0.y" });
        assertErrors({ var: "1" });
        assertErrors({ var: "x." }, "data access path doesn't have a valid format: x.");
    });
});
//# sourceMappingURL=test-format-validator.js.map