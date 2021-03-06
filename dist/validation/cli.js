#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const index_1 = require("./index");
const exprPath = process.argv[2];
if (!exprPath) {
    console.error(`Usage: certlogic-validate <path of JSON file containing CertLogic expression>`);
    process.exit(2);
}
if (!(0, fs_1.existsSync)(exprPath)) {
    console.error(`expression path ${exprPath} is not valid: file doesn't exist`);
    process.exit(2);
}
try {
    const expr = JSON.parse((0, fs_1.readFileSync)(exprPath, "utf8").toString());
    console.log(JSON.stringify((0, index_1.validate)(expr), null, 2));
}
catch (e) {
    console.error(`couldn't read file ${exprPath} as JSON: ${e.message}`);
}
//# sourceMappingURL=cli.js.map