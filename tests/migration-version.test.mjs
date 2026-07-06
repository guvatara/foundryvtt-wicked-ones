import assert from "node:assert/strict";
import test from "node:test";

/** Foundry Number settings commonly coerce semver via parseFloat. */
function coerceMigrationSetting(value) {
  const parsed = parseFloat(value);
  return Number.isNaN(parsed) ? Number(value) : parsed;
}

/** Mirrors wicked.js ready-hook migration gate check. */
function needsMigration(currentVersion, gate = 0.91) {
  return (currentVersion < gate) || (currentVersion === null);
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
