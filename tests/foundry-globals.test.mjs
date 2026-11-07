import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync, readdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

/**
 * Foundry v13 removed the global shims for these helpers; only `foundry.utils.*` remains.
 * A bare call throws ReferenceError at runtime, and only inside the code path that runs
 * (the world migration, for example, is rarely executed) — hence this static guard.
 */
const REMOVED_GLOBALS = [
  "isObjectEmpty",
  "mergeObject",
  "duplicate",
  "getProperty",
  "setProperty",
  "expandObject",
  "flattenObject",
  "randomID",
  "deepClone",
  "getType",
  "isNewerVersion",
  "timeSince",
  "debounce",
  "throttle",
  "escapeHTML",
  "cleanHTML",
  "formatDate",
  "sortBy",
  "filterObject",
  "hasProperty"
];

const moduleDir = join(dirname(fileURLToPath(import.meta.url)), "..", "module");

/** Strip comments so prose about a helper is not reported as a call. */
function stripComments(source) {
  return source
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/(^|[^:"'`\\])\/\/[^\n]*/g, "$1");
}

test("no v13-removed Foundry globals are called by module code", () => {
  const offenders = [];

  for (const file of readdirSync(moduleDir).filter((name) => name.endsWith(".js"))) {
    const source = stripComments(readFileSync(join(moduleDir, file), "utf8"));

    for (const name of REMOVED_GLOBALS) {
      const bareCall = new RegExp(`(?<![\\w.$])${name}\\s*\\(`);
      if (bareCall.test(source)) offenders.push(`${file}: ${name}()`);
    }
  }

  assert.deepEqual(offenders, [], `use foundry.utils.* instead:\n${offenders.join("\n")}`);
});

test("foundry.utils helpers are allowed", () => {
  const source = "const x = foundry.utils.mergeObject({}, {});";
  assert.equal(/(?<![\w.$])mergeObject\s*\(/.test(source), false);
});
