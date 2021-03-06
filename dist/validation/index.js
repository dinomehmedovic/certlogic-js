"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = exports.validateFormat = exports.dataAccessesWithContext = exports.dataAccesses = void 0;
var data_accesses_1 = require("./data-accesses");
Object.defineProperty(exports, "dataAccesses", { enumerable: true, get: function () { return data_accesses_1.dataAccesses; } });
Object.defineProperty(exports, "dataAccessesWithContext", { enumerable: true, get: function () { return data_accesses_1.dataAccessesWithContext; } });
var format_validator_1 = require("./format-validator");
Object.defineProperty(exports, "validateFormat", { enumerable: true, get: function () { return format_validator_1.validateFormat; } });
const format_validator_2 = require("./format-validator");
/**
 * Validate the given CertLogic expression, and return any violations as {@link ValidationError validation errors}.
 */
const validate = (expr) => (0, format_validator_2.validateFormat)(expr);
exports.validate = validate;
//# sourceMappingURL=index.js.map