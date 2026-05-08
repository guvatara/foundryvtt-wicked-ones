<p align="center"><img src="readme-images/WWfoundry.png" alt="Wicked Ones for Foundry"></p>

# Wicked Ones Game System for Foundry VTT

Official-ish community system for playing **Wicked Ones** in Foundry VTT.

- Foundry compatibility: **minimum v13**, **verified on v14**
- System ID: `wicked-ones`
- Languages included: **English** (`en`) and **Russian** (`ru`)

Project page: [Wicked Ones – Bandit Camp](https://banditcamp.io/wickedones/)

---

## Installation

### Manifest URL

1. Copy this URL:
   `https://github.com/eHanus/foundryvtt-wicked-ones/releases/latest/download/system.json`
2. In Foundry, open **Install System** and paste it into **Manifest URL**.

### Foundry System Browser

Find **Wicked Ones** and click **Install**.

---

## What’s Included

The system provides dedicated sheets and workflow for core Wicked Ones play:

- Actor sheets: Characters, Minion Packs, Dungeons, Factions, Parties, Clocks, plus GM/UA sheets
- Item ecosystem: Adventurers, Callings, Duties, Projects, Defenses, Themes, Gear/Supply, Impulses, and more
- Dice/roll flow: action-style rolls, resistance/death resistance, loot/trap/creature/fortune and related roll chat cards
- Compendia with game content and localization support

---

## Basic Usage Notes

- Most counters (XP, Gold, progress bars, clocks) can be reset from their labels/controls.
- Items can be added with `+` controls or by drag-and-drop from compendia.
- Tooltip-heavy UI: hover many labels/icons for extra rules context.
- Clicking an item opens its full editable sheet (title + description + metadata).
- Red dots / clock controls reset bars and clocks; trash icons remove embedded items.
- Shock can auto-apply `-1D`, but does not auto-clear after rolling.

### Actor Sheets

- Action and resistance checks are triggered from sheet attributes and open the roll dialog.
- Practice XP is tracked through the skill checkbox progression.

### Clocks

- Create a new actor of type **Clock**.
- You can drag it to a scene as a token; progress syncs with the sidebar clock actor.

### GM Quick Rolls

- The dice icon in scene controls opens a roll picker for common/non-sheet roll types.

### Permissions

If players should create world items directly, use elevated permissions (e.g. Trusted / Assistant / custom role rules).  
Without that, they can still use and edit most sheet-embedded entries.

### Optional Asset Pack

The official Wicked Ones art/token pack is strongly recommended for maps and richer presentation.

---

## Localization

- UI strings live in:
  - `lang/en.json`
  - `lang/ru.json` (active RU localization in `system.json`)
- Additional RU mirror file exists for compatibility:
  - `lang/ru-ru.json`
- Compendium translation assets are under:
  - `packs/translations/`

When adding a new language, mirror key structure from `lang/en.json`.

---

## Development

This repository uses **native ES modules** (no JS build step).

### Local setup

Symlink or copy this repo into your Foundry data path:
`Data/systems/wicked-ones/`

### Styling

SCSS is compiled manually:

```bash
sass scss/style.scss styles/wicked.css
```

There are currently no automated tests; validation is done in Foundry by running key sheet/roll flows.

---

## Release Packaging

Releases are produced by GitHub Actions on release publish and bundle:

- `system.json`, `template.json`, `CHANGELOG.txt`, `LICENSE.txt`
- `fonts/`, `lang/`, `module/`, `packs/`, `styles/`, `templates/`

Note: `system.json` version is auto-substituted during release workflow.

---

## Screenshots

*(Click images for full size in GitHub UI.)*

### Wicked One and Minion Sheet
![Main Sheets](readme-images/wominionscompendia.png)

### Adventurers, Dungeons, and Clocks
![Adventurers, Dungeons and Clocks Sheets](readme-images/othersheets.png)

### Example World Map with Faction Markers
![Example World Map](readme-images/factions.png)

### Rolls and Dice (with Dice So Nice!)
![Rolls and Dice](readme-images/dice.png)

### Roll Popups
![Popups](readme-images/rollers.png)

### Editable Item Windows
![Editable items](readme-images/items.png)

---

## Suggested Modules

- `Dice So Nice!`
- `Chat Images`
- `Drag Upload`
- `Select tool everywhere`
- `Better Text Drawings`

Module compatibility may change across Foundry/module versions.

---

## Troubleshooting

- If a dragged item seems missing, check the **All** tab on the sheet.

---

## Credits

- Based on **Wicked Ones** by Ben Nielson and Victor Costa.
- Wicked Ones is based on **Blades in the Dark** (Forged in the Dark License), by John Harper / One Seven Design, licensed under CC BY 3.0.

