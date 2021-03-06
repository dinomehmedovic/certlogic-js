#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const index_1 = require("./index");
const exprPath = process.argv[2];
const dataPath = process.argv[3];
if (!exprPath) {
    console.error(`Usage: certlogic-run <path of JSON file containing CertLogic expression> <path of JSON file containing the data context>`);
    process.exit(2);
}
if (!(0, fs_1.existsSync)(exprPath)) {
    console.error(`expression path ${exprPath} (arg. #1) is not valid: file doesn't exist`);
    process.exit(2);
}
if (!(0, fs_1.existsSync)(dataPath)) {
    console.error(`data path ${exprPath} (arg. #2) is not valid: file doesn't exist`);
    process.exit(2);
}
try {
    const expr = JSON.parse((0, fs_1.readFileSync)(exprPath, "utf8").toString());
    const data = JSON.parse((0, fs_1.readFileSync)(dataPath, "utf8").toString());
    console.log(JSON.stringify((0, index_1.evaluate)(expr, data), null, 2));
}
catch (e) {
    console.error(`couldn't read file ${exprPath} as JSON: ${e.message}`);
}
//# sourceMappingURL=cli.js.map