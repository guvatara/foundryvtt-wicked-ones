import assert from "node:assert/strict";
import test from "node:test";
import { _patchLegacyRollData } from "../module/migration.js";

/** Minimal legacy (pre-V12) roll payload: a d6 pool whose term has no `class`. */
function legacyRoll(extraTerm = null) {
  const terms = [
    { number: 3, faces: 6, results: [{ result: 6, active: true }, { result: 2, active: true }] }
  ];
  if (extraTerm) terms.push(extraTerm);
  return { class: "Roll", formula: "3d6", terms };
}

test("dice term without class is patched to Die", () => {
  const { changed, data } = _patchLegacyRollData(JSON.stringify(legacyRoll()));
  assert.equal(changed, true);
  assert.equal(data.terms[0].class, "Die");
});

test("already patched rolls are reported as unchanged", () => {
  const roll = legacyRoll();
  roll.terms[0].class = "Die";
  const { changed, data } = _patchLegacyRollData(roll);
  assert.equal(changed, false);
  assert.equal(data.terms[0].class, "Die");
});

test("operator terms keep their own class and are not marked as dice", () => {
  const roll = legacyRoll({ operator: "+" });
  const { data } = _patchLegacyRollData(roll);
  assert.equal(data.terms[1].class, undefined);
  assert.equal(data.terms[1].operator, "+");
});

test("operator term alone does not flag the payload as changed", () => {
  const roll = { class: "Roll", terms: [{ operator: "-" }] };
  assert.equal(_patchLegacyRollData(roll).changed, false);
});

test("unparseable string payload is dropped", () => {
  const result = _patchLegacyRollData("{not json");
  assert.equal(result.changed, true);
  assert.equal(result.data, null);
});

test("payload without terms array is dropped", () => {
  const result = _patchLegacyRollData({ class: "Roll" });
  assert.equal(result.changed, true);
  assert.equal(result.data, null);
});

test("caller payload is not mutated", () => {
  const roll = legacyRoll();
  _patchLegacyRollData(roll);
  assert.equal(roll.terms[0].class, undefined);
});
