export { dataAccesses, dataAccessesWithContext } from "./data-accesses";
export { validateFormat } from "./format-validator";
export { ValidationError } from "./typings";
import { ValidationError } from "./typings";
/**
 * Validate the given CertLogic expression, and return any violations as {@link ValidationError validation errors}.
 */
export declare const validate: (expr: any) => ValidationError[];
//# sourceMappingURL=index.d.ts.map