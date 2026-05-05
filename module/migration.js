/**
 * Perform a system migration for the entire World, applying migrations for Actors, Items, and Compendium packs
 * @return {Promise}      A Promise which resolves once the migration is completed
 */
export const migrateWorld = async function() {
  ui.notifications.info(game.i18n.format("FITD.MIGRATION.Applying", { version: game.system.version }), {permanent: true});

    // Migrate World Actors
    // Use game.actors.contents (array of Actor documents) for Foundry VTT 13+
    for ( let a of game.actors.contents ) {
        if (a.type === 'character') {
            try {
                const updateData = _migrateActor(a);
                if ( !isObjectEmpty(updateData) ) {
                    console.log(`Migrating Actor entity ${a.name}`);
                    await a.update(updateData, {enforceTypes: false});
                }
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