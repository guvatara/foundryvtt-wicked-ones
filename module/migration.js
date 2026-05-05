/**
 * Perform a system migration for the entire World, applying migrations for Actors, Items, and Compendium packs
 * @return {Promise}      A Promise which resolves once the migration is completed
 */
export const migrateWorld = async function() {
  ui.notifications.info(game.i18n.format("FITD.MIGRATION.Applying", { version: game.system.version }), {permanent: true});

    // Migrate World Actors
    // Use game.actors.contents (array of Actor documents) for Foundry VTT 13+
    for ( let a of game.actors.contents ) {
        if (a.type === 'character' || a.type === 'minion_pack') {
            try {
                const updateData = _migrateActor(a);
                if ( !isObjectEmpty(updateData) ) {
                    console.log(`Migrating Actor entity ${a.name}`);
                    await a.update(updateData, {enforceTypes: false});
                }
                await _migrateEmbeddedMinionUpgrades(a);
            } catch(err) {
                console.error(err);
            }
        }
    }

  // Set the migration as complete
  game.settings.set("wicked-ones", "systemMigrationVersion", game.system.version);
  ui.notifications.info(game.i18n.format("FITD.MIGRATION.Complete", { version: game.system.version }), {permanent: true});
};

/* -------------------------------------------- */

/* -------------------------------------------- */
/*  Entity Type Migration Helpers               */
/* -------------------------------------------- */

/**
 * Migrate the actor attributes
 * @param {Actor} actor   The actor to Update
 * @return {Object}       The updateData to apply
 */
function _migrateActor(actor) {

  let updateData = {}

  // Add future migration code to change DB entries

  return updateData;

  // for ( let k of Object.keys(actor.data.attributes || {}) ) {
  //   if ( k in b ) updateData[`data.bonuses.${k}`] = b[k];
  //   else updateData[`data.bonuses.-=${k}`] = null;
  // }
}

/* -------------------------------------------- */

/**
 * Normalize legacy minion upgrades on minion pack actors.
 * Handles old `data` schema and ensures `system.upgrade_type` exists.
 *
 * @param {Actor} actor
 * @returns {Promise<void>}
 */
async function _migrateEmbeddedMinionUpgrades(actor) {
  if (actor.type !== "minion_pack") return;

  const updates = [];
  for (const item of actor.items) {
    if (item.type !== "minion_upgrade") continue;

    const update = _migrateMinionUpgradeItem(item);
    if (!isObjectEmpty(update)) updates.push(update);
  }

  if (updates.length === 0) return;

  console.log(`Migrating ${updates.length} minion upgrades for ${actor.name}`);
  await actor.updateEmbeddedDocuments("Item", updates, { enforceTypes: false });
}

/**
 * Build update payload for a single minion upgrade item.
 *
 * @param {Item} item
 * @returns {Object}
 */
function _migrateMinionUpgradeItem(item) {
  const update = { _id: item.id };
  let changed = false;

  // Foundry v10 legacy data payload compatibility.
  const legacyData = item.data?._source?.data ?? item._source?.data;
  const sourceSystem = item.system ?? {};

  const fieldsFromLegacy = [
    "description",
    "upgrade_type",
    "upgrade_checkbox_text",
    "upgrade_checkbox_checked",
    "upgrade_checkbox_2_text",
    "upgrade_checkbox_2_checked",
    "upgrade_skill_name",
    "upgrade_skill_value",
    "is_for_wo",
    "is_for_ua"
  ];

  if (legacyData && typeof legacyData === "object") {
    for (const field of fieldsFromLegacy) {
      if (sourceSystem[field] === undefined && legacyData[field] !== undefined) {
        update[`system.${field}`] = legacyData[field];
        changed = true;
      }
    }
    update["data"] = null;
    changed = true;
  }

  if (sourceSystem.upgrade_type === undefined || sourceSystem.upgrade_type === "") {
    update["system.upgrade_type"] = "regular";
    changed = true;
  }

  if (!changed) return {};
  return update;
}

/* -------------------------------------------- */