import { installPanes } from "./panes.mjs";

const ID = "forge-them-all";
const { ApplicationV2, HandlebarsApplicationMixin } = foundry.applications.api;
const MAIN_TABS = [
  { id: "fantasies", label: "FTA.Home.Tabs.Fantasies", icon: "fa-wand-sparkles" },
  { id: "library", label: "FTA.Home.Tabs.Library", icon: "fa-book" },
  { id: "campaigns", label: "FTA.Home.Tabs.Campaigns", icon: "fa-flag" }
];
const EDITOR_TABS = [
  { id: "writing", label: "FTA.Editor.Tabs.Writing", icon: "fa-feather" },
  { id: "maps", label: "FTA.Editor.Tabs.Maps", icon: "fa-map" },
  { id: "session", label: "FTA.Editor.Tabs.Session", icon: "fa-dice-d20" },
  { id: "time", label: "FTA.Editor.Tabs.Time", icon: "fa-hourglass-half" },
  { id: "encounters", label: "FTA.Editor.Tabs.Encounters", icon: "fa-scale-balanced" },
  { id: "investigation", label: "FTA.Editor.Tabs.Investigation", icon: "fa-magnifying-glass" }
];
/** Le catalogue permanent de l'éditeur, dans l'ordre des documents. */
const CATALOGUE = [
  { id: "npcs", label: "FTA.Catalogue.Npcs", icon: "fa-user" },
  { id: "contacts", label: "FTA.Catalogue.Contacts", icon: "fa-address-book" },
  { id: "items", label: "FTA.Catalogue.Items", icon: "fa-gem" },
  { id: "clues", label: "FTA.Catalogue.Clues", icon: "fa-fingerprint" },
  { id: "documents", label: "FTA.Catalogue.Documents", icon: "fa-file-lines" },
  { id: "images", label: "FTA.Catalogue.Images", icon: "fa-image" },
  { id: "places", label: "FTA.Catalogue.Places", icon: "fa-location-dot" },
  { id: "fantasies", label: "FTA.Catalogue.Fantasies", icon: "fa-wand-sparkles" }
];

const localize = key => game.i18n.localize(key);
const fantasiesEnabled = () => game.settings.get(ID, "fantasiesEnabled");
const tabsFor = (tabs, active) => tabs.map(t => ({ ...t, label: localize(t.label), active: t.id === active }));

/**
 * Coquille commune : contenu de fenêtre sans défilement propre (chaque zone défile seule), taille minimale,
 * panneaux latéraux redimensionnables. Les onglets sont ceux d'ApplicationV2 (data-action="tab", changeTab) :
 * changer d'onglet ne reconstruit pas la fenêtre et garde le défilement de chaque zone.
 */
class ForgeWindow extends HandlebarsApplicationMixin(ApplicationV2) {
  static MINIMUM = { width: 640, height: 420 };
  /** Clé du navigateur où chaque utilisateur garde la largeur des panneaux de cette fenêtre. */
  static PANES_KEY = `${ID}.panes`;
  async _onRender(context, options) {
    await super._onRender(context, options);
    const { width, height } = this.constructor.MINIMUM;
    Object.assign(this.element.style, { minWidth: `min(${width}px, 100vw)`, minHeight: `min(${height}px, 100vh)` });
    const root = this.element.querySelector("[data-panes-root]");
    if (root) installPanes(root, this.constructor.PANES_KEY);
  }
}

export class AtelierHome extends ForgeWindow {
  static DEFAULT_OPTIONS = {
    id: "forge-them-all-home",
    classes: ["forge-them-all", "fta-window"],
    window: { title: "Forge Them'All", icon: "fa-solid fa-hammer", resizable: true },
    position: { width: 1100, height: 700 },
    actions: {
      openEditor: AtelierHome.openEditor,
      setDisplayMode: AtelierHome.setDisplayMode
    }
  };
  static PARTS = {
    main: { template: `modules/${ID}/templates/home.hbs` }
  };
  static PANES_KEY = `${ID}.panes.home`;
  displayMode = "tiles";
  constructor(options = {}) {
    super(options);
    this.tabGroups.main = game.settings.get(ID, "lastMainTab");
  }
  async _prepareContext(options) {
    const context = await super._prepareContext(options);
    const enabled = fantasiesEnabled();
    if (!MAIN_TABS.some(t => t.id === this.tabGroups.main) || (!enabled && this.tabGroups.main === "fantasies")) {
      this.tabGroups.main = enabled ? "fantasies" : "library";
    }
    const rta = game.forgeThemAll?.getRuleThemAll?.() ?? null;
    const tabs = tabsFor(MAIN_TABS.filter(t => t.id !== "fantasies" || enabled), this.tabGroups.main);
    return {
      ...context,
      tabs,
      active: Object.fromEntries(tabs.map(t => [t.id, t.active])),
      fantasiesEnabled: enabled,
      rtaReady: Boolean(rta),
      displayTiles: this.displayMode === "tiles",
      displayLines: this.displayMode === "lines",
      version: game.modules.get(ID)?.version ?? ""
    };
  }
  changeTab(tab, group, options) {
    super.changeTab(tab, group, options);
    if (group === "main") game.settings.set(ID, "lastMainTab", tab).catch(() => {});
  }
  static openEditor(_event, button) {
    const mode = button.dataset.mode === "instance" ? "instance" : "source";
    new ScenarioEditor({ scenarioRef: null, mode }).render({ force: true });
  }
  static setDisplayMode(_event, button) {
    const mode = button.dataset.mode === "lines" ? "lines" : "tiles";
    if (mode === this.displayMode) return;
    this.displayMode = mode;
    this.render();
  }
}

export class ScenarioEditor extends ForgeWindow {
  static DEFAULT_OPTIONS = {
    classes: ["forge-them-all", "fta-window", "fta-editor-window"],
    window: { title: "FTA.Editor.Title", icon: "fa-solid fa-feather", resizable: true },
    position: { width: 1240, height: 760 }
  };
  static PARTS = {
    main: { template: `modules/${ID}/templates/editor.hbs` }
  };
  static MINIMUM = { width: 720, height: 460 };
  static PANES_KEY = `${ID}.panes.editor`;
  constructor({ scenarioRef = null, mode = "source", ...options } = {}) {
    super(options);
    this.scenarioRef = scenarioRef;
    this.mode = mode === "instance" ? "instance" : "source";
    this.tabGroups.editor = "writing";
  }
  async _prepareContext(options) {
    const context = await super._prepareContext(options);
    const enabled = fantasiesEnabled();
    const tabs = tabsFor(EDITOR_TABS, this.tabGroups.editor);
    return {
      ...context,
      tabs,
      active: Object.fromEntries(tabs.map(t => [t.id, t.active])),
      isInstance: this.mode === "instance",
      modeLabel: localize(this.mode === "instance" ? "FTA.Editor.Mode.Instance" : "FTA.Editor.Mode.Source"),
      catalogue: CATALOGUE.filter(c => c.id !== "fantasies" || enabled).map(c => ({ ...c, label: localize(c.label) }))
    };
  }
}

/** Re-rend les fenêtres ouvertes du module (après un changement de réglage). */
export function refreshOpenWindows() {
  for (const app of foundry.applications.instances.values()) {
    if (app instanceof ForgeWindow && app.rendered) app.render();
  }
}
