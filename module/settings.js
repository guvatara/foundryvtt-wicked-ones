/** Numeric migration gate for the current one-time world migration (0.9.1). */
export const SYSTEM_MIGRATION_VERSION = 0.91;

export const registerSystemSettings = function() {

  /**
   * Track the system version upon which point a migration was last applied
   */
  game.settings.register("wicked-ones", "systemMigrationVersion", {
    name: "SETTINGS.SystemMigrationVersion.Name",
    scope: "world",
    config: false,
    type: Number,
    default: 0.9
  });

  /**
   * Configuration for showing expanded roll results in the chat log
   */
  game.settings.register("wicked-ones", "showExpandedRollResults", {
    name: "SETTINGS.WOExpandedResults.Name",
    hint: "SETTINGS.WOExpandedResults.Label",
    scope: "client",
    config: true,
    type: Boolean,
    default: true
  });
};
