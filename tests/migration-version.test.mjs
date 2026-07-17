import assert from "node:assert/strict";
import test from "node:test";
import { _shouldCopyLegacyField } from "../module/migration.js";

/** Foundry Number settings commonly coerce semver via parseFloat. */
function coerceMigrationSetting(value) {
  const parsed = parseFloat(value);
  return Number.isNaN(parsed) ? Number(value) : parsed;
}

/** Mirrors wicked.js ready-hook migration gate check. */
function needsMigration(currentVersion, gate = 0.91) {
  return (currentVersion === null)
    || !Number.isFinite(currentVersion)
    || (currentVersion < gate);
}

test("semver system version coerces below migration gate", () => {
  const stored = coerceMigrationSetting("0.9.3");
  assert.equal(stored, 0.9);
  assert.ok(needsMigration(stored));
});

test("numeric migration gate clears the ready hook", () => {
  assert.equal(needsMigration(0.91), false);
  assert.equal(needsMigration(0.92), false);
});

test("default setting value still requires one migration", () => {
  assert.ok(needsMigration(0.9));
});

test("storing semver never reaches the 0.91 gate", () => {
  for (const version of ["0.9.3", "0.9.10", "0.9.99"]) {
    const stored = coerceMigrationSetting(version);
    assert.ok(stored < 0.91, `expected ${version} to coerce below gate, got ${stored}`);
  }
});

test("non-finite stored migration version re-triggers migration", () => {
  assert.ok(needsMigration(Number("not-a-version")));
  assert.ok(needsMigration(Number("0.9.3")));
});

test("legacy checkbox checked state copies over template default false", () => {
  assert.equal(_shouldCopyLegacyField("upgrade_checkbox_checked", false, true), true);
  assert.equal(_shouldCopyLegacyField("upgrade_checkbox_2_checked", false, true), true);
});

test("legacy skill rating copies over template default 2", () => {
  assert.equal(_shouldCopyLegacyField("upgrade_skill_value", 2, 4), true);
});

test("legacy minion applicability copies over template defaults", () => {
  assert.equal(_shouldCopyLegacyField("is_for_wo", true, false), true);
  assert.equal(_shouldCopyLegacyField("is_for_ua", true, false), true);
});

test("legacy upgrade type copies over template default regular", () => {
  assert.equal(_shouldCopyLegacyField("upgrade_type", "regular", "path"), true);
  assert.equal(_shouldCopyLegacyField("upgrade_type", "regular", "external"), true);
});

test("empty legacy upgrade_type does not replace regular default", () => {
  assert.equal(_shouldCopyLegacyField("upgrade_type", "regular", ""), false);
});

test("legacy external upgrade_type copies over empty current value", () => {
  assert.equal(_shouldCopyLegacyField("upgrade_type", "", "external"), true);
  assert.equal(_shouldCopyLegacyField("upgrade_type", "", "path"), true);
});

/** Mirrors _migrateMinionUpgradeItem upgrade_type fallback guard. */
function applyUpgradeTypeFallback(sourceSystem, update) {
  if ((sourceSystem.upgrade_type === undefined || sourceSystem.upgrade_type === "")
    && update["system.upgrade_type"] === undefined) {
    update["system.upgrade_type"] = "regular";
  }
}

test("legacy external upgrade_type is not overwritten by regular fallback", () => {
  const update = { "system.upgrade_type": "external" };
  applyUpgradeTypeFallback({ upgrade_type: "" }, update);
  assert.equal(update["system.upgrade_type"], "external");
});

test("missing upgrade_type still defaults to regular", () => {
  const update = {};
  applyUpgradeTypeFallback({ upgrade_type: "" }, update);
  assert.equal(update["system.upgrade_type"], "regular");
});

test("user-edited values are not overwritten by legacy migration", () => {
  assert.equal(_shouldCopyLegacyField("upgrade_checkbox_checked", true, false), false);
  assert.equal(_shouldCopyLegacyField("upgrade_skill_value", 3, 4), false);
  assert.equal(_shouldCopyLegacyField("upgrade_type", "external", "regular"), false);
});
