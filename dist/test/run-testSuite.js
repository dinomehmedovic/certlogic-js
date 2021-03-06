"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const path_1 = require("path");
const evaluator_1 = require("../evaluator");
const { deepEqual } = require("chai").assert;
const testDirective2MochaFunc = (testDirective, mochaFunc) => testDirective === undefined ? mochaFunc : mochaFunc[testDirective];
const runTestsOn = (testSuite) => {
    testDirective2MochaFunc(testSuite.directive, describe)(testSuite.name, () => {
        testSuite.cases
            .forEach((testCase) => {
            testDirective2MochaFunc(testCase.directive, it)(testCase.name, () => {
                testCase.assertions
                    .forEach((assertion, index) => {
                    const assertionText = assertion.message || `#${index + 1}`;
                    if (assertion.certLogicExpression === undefined && testCase.certLogicExpression === undefined) {
                        console.error(`     !! no CertLogic expression defined on assertion ${assertionText}, and neither on encompassing test case "${testCase.name}"`);
                    }
                    switch (assertion.directive) {
                        case "skip": {
                            console.warn(`      ! skipped assertion ${assertionText}`);
                            return;
                        }
                        case "only": {
                            console.warn(`      (test directive 'only' not supported on assertions - ignoring)`);
                        }
                    }
                    deepEqual((0, evaluator_1.evaluate)((assertion.certLogicExpression !== undefined ? assertion.certLogicExpression : testCase.certLogicExpression), assertion.data), assertion.expected, assertion.message || JSON.stringify(assertion.data));
                });
            });
        });
    });
};
const testSuitesPath = (0, path_1.join)(__dirname, "../../../specification/testSuite");
(0, fs_1.readdirSync)(testSuitesPath)
    .filter((path) => path.endsWith(".json"))
    .forEach((path) => runTestsOn(JSON.parse((0, fs_1.readFileSync)((0, path_1.join)(testSuitesPath, path), "utf8"))));
//# sourceMappingURL=run-testSuite.js.map