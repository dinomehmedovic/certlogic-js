"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.evaluate = void 0;
const typings_1 = require("./typings");
const internals_1 = require("./internals");
const evaluateVar = (value, data) => {
    if (typeof value !== "string") {
        throw new Error(`not of the form { "var": "<path>" }`);
    }
    const path = value;
    if (path === "") { // "it"
        return data;
    }
    return path.split(".").reduce((acc, fragment) => {
        if (acc === null) {
            return null;
        }
        const index = parseInt(fragment, 10);
        const value = isNaN(index) ? acc[fragment] : acc[index];
        return value === undefined ? null : value;
    }, data);
};
const evaluateIf = (guard, then, else_, data) => {
    if (guard === undefined) {
        throw new Error(`an if-operation must have a guard (argument #1)`);
    }
    if (then === undefined) {
        throw new Error(`an if-operation must have a then (argument #2)`);
    }
    if (else_ === undefined) {
        throw new Error(`an if-operation must have an else (argument #3)`);
    }
    const evalGuard = (0, exports.evaluate)(guard, data);
    if ((0, internals_1.isTruthy)(evalGuard)) {
        return (0, exports.evaluate)(then, data);
    }
    if ((0, internals_1.isFalsy)(evalGuard)) {
        return (0, exports.evaluate)(else_, data);
    }
    throw new Error(`if-guard evaluates to something neither truthy, nor falsy: ${evalGuard}`);
};
const compareFunctionFor = (operator) => (l, r) => {
    switch (operator) {
        case "<": return l < r;
        case ">": return l > r;
        case "<=": return l <= r;
        case ">=": return l >= r;
    }
};
const compare = (operator, values) => {
    const compFunc = compareFunctionFor(operator);
    switch (values.length) {
        case 2: return compFunc(values[0], values[1]);
        case 3: return compFunc(values[0], values[1]) && compFunc(values[1], values[2]);
        default: throw new Error(`invalid number of operands to a "${operator}" operation`);
    }
};
const comparisonOperatorForDateTimeComparison = (operator) => {
    switch (operator) {
        case "after": return ">";
        case "before": return "<";
        case "not-after": return "<=";
        case "not-before": return ">=";
    }
};
const evaluateInfix = (operator, values, data) => {
    switch (operator) {
        case "and": {
            if (values.length < 2)
                throw new Error(`an "and" operation must have at least 2 operands`);
            break;
        }
        case "<":
        case ">":
        case "<=":
        case ">=":
        case "after":
        case "before":
        case "not-after":
        case "not-before": {
            if (values.length < 2 || values.length > 3)
                throw new Error(`an operation with operator "${operator}" must have 2 or 3 operands`);
            break;
        }
        default: {
            if (values.length !== 2)
                throw new Error(`an operation with operator "${operator}" must have 2 operands`);
            break;
        }
    }
    const evalArgs = values.map((arg) => (0, exports.evaluate)(arg, data));
    switch (operator) {
        case "===": return evalArgs[0] === evalArgs[1];
        case "in": {
            const r = evalArgs[1];
            if (!Array.isArray(r)) {
                throw new Error(`right-hand side of an "in" operation must be an array`);
            }
            return r.indexOf(evalArgs[0]) > -1;
        }
        case "+": {
            const l = evalArgs[0];
            const r = evalArgs[1];
            if (!(0, internals_1.isInt)(l) || !(0, internals_1.isInt)(r)) {
                throw new Error(`operands of this operation must both be integers`);
            }
            return l + r;
        }
        case "and": return values.reduce((acc, current) => {
            if ((0, internals_1.isFalsy)(acc)) {
                return acc;
            }
            if ((0, internals_1.isTruthy)(acc)) {
                return (0, exports.evaluate)(current, data);
            }
            throw new Error(`all operands of an "and" operation must be either truthy or falsy`);
        }, true);
        case "<":
        case ">":
        case "<=":
        case ">=": {
            if (!evalArgs.every(internals_1.isInt)) {
                throw new Error(`all operands of a comparison operation must be of integer type`);
            }
            return compare(operator, evalArgs);
        }
        case "after":
        case "before":
        case "not-after":
        case "not-before": {
            if (!evalArgs.every(internals_1.isDate)) {
                throw new Error(`all operands of a date-time comparison must be date-times`);
            }
            return compare(comparisonOperatorForDateTimeComparison(operator), evalArgs);
        }
        default: throw new Error(`unhandled infix operator "${operator}"`);
    }
};
const evaluateNot = (operandExpr, data) => {
    const operand = (0, exports.evaluate)(operandExpr, data);
    if ((0, internals_1.isFalsy)(operand)) {
        return true;
    }
    if ((0, internals_1.isTruthy)(operand)) {
        return false;
    }
    throw new Error(`operand of ! evaluates to something neither truthy, nor falsy: ${operand}`);
};
const evaluatePlusTime = (dateOperand, amount, unit, data) => {
    if (!(0, internals_1.isInt)(amount)) {
        throw new Error(`"amount" argument (#2) of "plusTime" must be an integer`);
    }
    if (typings_1.timeUnits.indexOf(unit) === -1) {
        throw new Error(`"unit" argument (#3) of "plusTime" must be a string with one of the time units: ${typings_1.timeUnits.join(", ")}`);
    }
    const dateTimeStr = (0, exports.evaluate)(dateOperand, data);
    if (typeof dateTimeStr !== "string") {
        throw new Error(`date argument of "plusTime" must be a string`);
    }
    return (0, internals_1.plusTime)(dateTimeStr, amount, unit);
};
const evaluateReduce = (operand, lambda, initial, data) => {
    const evalOperand = (0, exports.evaluate)(operand, data);
    const evalInitial = () => (0, exports.evaluate)(initial, data);
    if (evalOperand === null) {
        return evalInitial();
    }
    if (!Array.isArray(evalOperand)) {
        throw new Error(`operand of reduce evaluated to a non-null non-array`);
    }
    return evalOperand
        .reduce((accumulator, current) => (0, exports.evaluate)(lambda, { accumulator, current /* (patch:) , data */ }), evalInitial());
};
const evaluateExtractFromUVCI = (operand, index, data) => {
    const evalOperand = (0, exports.evaluate)(operand, data);
    if (!(evalOperand === null || typeof evalOperand === "string")) {
        throw new Error(`"UVCI" argument (#1) of "extractFromUVCI" must be either a string or null`);
    }
    if (!(0, internals_1.isInt)(index)) {
        throw new Error(`"index" argument (#2) of "extractFromUVCI" must be an integer`);
    }
    return (0, internals_1.extractFromUVCI)(evalOperand, index);
};
const evaluate = (expr, data) => {
    if (typeof expr === "string" || (0, internals_1.isInt)(expr) || typeof expr === "boolean") {
        return expr;
    }
    if (expr === null) {
        return true;
        // throw new Error(`invalid CertLogic expression: ${expr}`)
    }
    if (Array.isArray(expr)) {
        return expr.map((item) => (0, exports.evaluate)(item, data));
    }
    if (typeof expr === "object") { // That includes Date objects, but those have no keys, so are returned as-is.
        const keys = Object.keys(expr);
        if (keys.length !== 1) {
            throw new Error(`unrecognised expression object encountered`);
        }
        const operator = keys[0];
        const values = expr[operator];
        if (operator === "var") {
            return evaluateVar(values, data);
        }
        if (!(Array.isArray(values) && values.length > 0)) {
            throw new Error(`operation not of the form { "<operator>": [ <values...> ] }`);
        }
        if (operator === "if") {
            const [guard, then, else_] = values;
            return evaluateIf(guard, then, else_, data);
        }
        if (["===", "and", ">", "<", ">=", "<=", "in", "+", "after", "before", "not-after", "not-before"].indexOf(operator) > -1) {
            return evaluateInfix(operator, values, data);
        }
        if (operator === "!") {
            return evaluateNot(values[0], data);
        }
        if (operator === "plusTime") {
            return evaluatePlusTime(values[0], values[1], values[2], data);
        }
        if (operator === "reduce") {
            return evaluateReduce(values[0], values[1], values[2], data);
        }
        if (operator === "extractFromUVCI") {
            return evaluateExtractFromUVCI(values[0], values[1], data);
        }
        throw new Error(`unrecognised operator: "${operator}"`);
    }
    throw new Error(`invalid CertLogic expression: ${expr}`);
};
exports.evaluate = evaluate;
//# sourceMappingURL=evaluator.js.map