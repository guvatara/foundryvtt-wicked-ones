import assert from "node:assert/strict";
import test from "node:test";
import { WickedHelpers } from "../module/wicked-helpers.js";

/** Stub the Foundry globals the helper touches, plus a recording fetch. */
function stubFoundry({ manifest = null, packFiles = {} } = {}) {
  const calls = [];

  globalThis.game = { i18n: { lang: "ru" } };
  globalThis.fetch = async (url) => {
    calls.push(url);

    if (url.endsWith("/index.json")) {
      if (!manifest) return { ok: false, json: async () => ({}) };
      return { ok: true, json: async () => manifest };
    }

    const packName = url.match(/wicked-ones\.([\w-]+)\.json$/)?.[1];
    if (packName && packFiles[packName]) {
      return { ok: true, json: async () => packFiles[packName] };
    }

    return { ok: false, json: async () => ({}) };
  };

  WickedHelpers._compendiumTranslationCache.clear();
  WickedHelpers._compendiumTranslationDataCache.clear();

  return calls;
}

const manifest = {
  lang: "ru",
  packs: {
    calling: { label: "Призвания" }
  }
};

test("JournalEntry packs are never probed for a translation file", async () => {
  const calls = stubFoundry({ manifest });
  const pack = { metadata: { name: "system-documentation", type: "JournalEntry", label: "System Documentation" } };

  await WickedHelpers.localizeCompendiumMetadata(pack);

  assert.deepEqual(calls, []);
  assert.equal(pack.metadata.label, "System Documentation");
});

test("packs missing from the locale manifest are not fetched", async () => {
  const calls = stubFoundry({ manifest });
  const pack = { metadata: { name: "untranslated-pack", type: "Item", label: "Untranslated" } };

  await WickedHelpers.localizeCompendiumMetadata(pack);

  assert.deepEqual(calls, ["systems/wicked-ones/packs/translations/ru/index.json"]);
  assert.equal(pack.metadata.label, "Untranslated");
});

test("translated pack takes its label from the translation file", async () => {
  const calls = stubFoundry({
    manifest,
    packFiles: { calling: { label: "Призвания", entries: { abc: { name: "Шаман" } } } }
  });
  const pack = { metadata: { name: "calling", type: "Item", label: "Callings" } };

  await WickedHelpers.localizeCompendiumMetadata(pack);

  assert.equal(pack.metadata.label, "Призвания");
  assert.deepEqual(calls, [
    "systems/wicked-ones/packs/translations/ru/index.json",
    "systems/wicked-ones/packs/translations/ru/wicked-ones.calling.json"
  ]);
});

test("without a manifest every Item pack is probed (backwards compatible)", async () => {
  const calls = stubFoundry({ manifest: null });

  await WickedHelpers.localizeCompendiumMetadata({ metadata: { name: "calling", type: "Item", label: "Callings" } });

  assert.deepEqual(calls, [
    "systems/wicked-ones/packs/translations/ru/index.json",
    "systems/wicked-ones/packs/translations/ru/wicked-ones.calling.json"
  ]);
});
