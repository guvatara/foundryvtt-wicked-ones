import assert from "node:assert/strict";
import { SYSTEM_MIGRATION_VERSION } from "../module/settings.js";
import { _shouldCopyLegacyField } from "../module/migration.js";

function needsMigration(currentVersion) {
  return (currentVersion < SYSTEM_MIGRATION_VERSION) || (currentVersion === null);
}

// Foundry Number settings coerce with parseFloat-style parsing (0.9.3 -> 0.9).
const coercedSemver = parseFloat("0.9.3");
assert.equal(coercedSemver, 0.9);
assert.equal(
  needsMigration(coercedSemver),
  true,
  "storing game.system.version in a Number setting leaves migration permanently enabled"
);

// Direct Number() on semver strings is also unreliable and must not be used as the gate.
assert.ok(Number.isNaN(Number("0.9.3")));

assert.equal(needsMigration(SYSTEM_MIGRATION_VERSION), false);
assert.equal(needsMigration(0.92), false);
assert.equal(needsMigration(null), true);

assert.equal(_shouldCopyLegacyField("description", undefined, "Legacy text"), true);
assert.equal(_shouldCopyLegacyField("description", "", "Legacy text"), true);
assert.equal(_shouldCopyLegacyField("description", "Current", "Legacy text"), false);
assert.equal(
  _shouldCopyLegacyField("upgrade_type", "regular", "path"),
  true,
  "default regular upgrade_type should accept a legacy value"
);

console.log("migration-version.test.mjs: all assertions passed");
