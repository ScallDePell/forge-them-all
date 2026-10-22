import { AtelierHome } from "./ui.mjs";

const ID = "forge-them-all";
let mainWindow = null;

/** Optional integration: never assume the Ruleset/Fantasy API exists. */
function getRuleThemAll() {
  if (!game.modules.get("rule-them-all")?.active) return null;
  return game.ruleThemAll ?? null;
}

function openAtelier() {
  if (!game.user?.isGM) {
    ui.notifications?.warn("Forge Them'All : accès réservé au MJ.");
    return null;
  }
  mainWindow ??= new AtelierHome();
  mainWindow.render(true);
  return mainWindow;
}

Hooks.once("init", () => {
  game.settings.register(ID, "fantasiesEnabled", {
    name: "Activer les Fantaisies",
    hint: "Seul le volet Fantaisies peut être désactivé. Les autres fonctions restent disponibles même sans Rule Them'All.",
    scope: "world", config: true, type: Boolean, default: true,
    restricted: true
  });
  game.settings.register(ID, "lastMainTab", {
    scope: "client", config: false, type: String, default: "fantasies"
  });
});

Hooks.once("ready", () => {
  game.forgeThemAll = Object.freeze({
    open: openAtelier,
    getRuleThemAll,
    get fantasiesEnabled() { return game.settings.get(ID, "fantasiesEnabled"); },
    version: "0.0.2"
  });
  // Integration can be called from macro: game.forgeThemAll.open()
  if (game.user?.isGM) ui.notifications?.info("Forge Them'All prêt : utilisez la macro game.forgeThemAll.open().");
});

// Optional convenience entry point in the native Journal directory.
Hooks.on("renderJournalDirectory", (_app, html) => {
  if (!game.user?.isGM) return;
  const root = html instanceof HTMLElement ? html : html?.[0];
  const header = root?.querySelector(".directory-header");
  if (!header || header.querySelector('[data-forge-open="true"]')) return;
  const button = document.createElement("button");
  button.type = "button";
  button.dataset.forgeOpen = "true";
  button.textContent = "Forge Them'All";
  button.addEventListener("click", openAtelier);
  header.append(button);
});
