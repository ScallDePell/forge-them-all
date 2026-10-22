const ID = "forge-them-all";
const { ApplicationV2, HandlebarsApplicationMixin } = foundry.applications.api;
const MAIN_TABS = [
  { id: "fantasies", label: "Fantaisies" },
  { id: "library", label: "Bibliothèque de scénarios" },
  { id: "campaigns", label: "Gestion des campagnes" }
];
const EDITOR_TABS = [
  { id: "writing", label: "Écriture" },
  { id: "maps", label: "Cartes" },
  { id: "session", label: "Partie" },
  { id: "time", label: "Temps" },
  { id: "encounters", label: "Rencontres" },
  { id: "investigation", label: "Enquête & Pistes" }
];

export class AtelierHome extends HandlebarsApplicationMixin(ApplicationV2) {
  static DEFAULT_OPTIONS = {
    id: "forge-them-all-home",
    window: { title: "Forge Them'All", resizable: true },
    position: { width: 950, height: 660 },
    actions: {
      selectMainTab: AtelierHome.selectMainTab,
      openEditor: AtelierHome.openEditor
    }
  };
  static PARTS = {
    main: { template: "modules/forge-them-all/templates/home.hbs" }
  };
  constructor(options = {}) {
    super(options);
    this.selectedTab = game.settings.get(ID, "lastMainTab");
  }
  async _prepareContext(options) {
    const context = await super._prepareContext(options);
    const enabled = game.settings.get(ID, "fantasiesEnabled");
    if (!enabled && this.selectedTab === "fantasies") this.selectedTab = "library";
    const rtaActive = Boolean(game.modules.get("rule-them-all")?.active);
    const rtaReady = rtaActive && Boolean(game.ruleThemAll);
    return {
      ...context,
      tabs: MAIN_TABS.filter(t => t.id !== "fantasies" || enabled)
        .map(t => ({ ...t, active: t.id === this.selectedTab })),
      showFantasies: this.selectedTab === "fantasies" && enabled,
      showLibrary: this.selectedTab === "library",
      showCampaigns: this.selectedTab === "campaigns",
      rtaReady,
      rtaStatus: rtaReady ? "Rule Them'All détecté. Catalogue de Fantaisies en attente de contrat public." : "Rule Them'All indisponible. Le reste du module fonctionne.",
      notice: "Socle technique : données métier et commandes d'édition non implémentées dans cette version."
    };
  }
  static async selectMainTab(_event, button) {
    const tab = button.dataset.tab;
    if (!MAIN_TABS.some(t => t.id === tab)) return;
    if (tab === "fantasies" && !game.settings.get(ID, "fantasiesEnabled")) return;
    this.selectedTab = tab;
    await game.settings.set(ID, "lastMainTab", tab);
    await this.render();
  }
  static openEditor() {
    new ScenarioEditor().render(true);
  }
}

export class ScenarioEditor extends HandlebarsApplicationMixin(ApplicationV2) {
  static DEFAULT_OPTIONS = {
    window: { title: "Éditeur de scénario — prototype", resizable: true },
    position: { width: 1120, height: 730 },
    actions: { selectEditorTab: ScenarioEditor.selectEditorTab }
  };
  static PARTS = {
    main: { template: "modules/forge-them-all/templates/editor.hbs" }
  };
  constructor(options = {}) {
    super(options);
    this.selectedTab = "writing";
  }
  async _prepareContext(options) {
    const context = await super._prepareContext(options);
    return {
      ...context,
      tabs: EDITOR_TABS.map(t => ({ ...t, active: t.id === this.selectedTab })),
      selectedLabel: EDITOR_TABS.find(t => t.id === this.selectedTab)?.label,
      isWriting: this.selectedTab === "writing",
      isMaps: this.selectedTab === "maps",
      isSession: this.selectedTab === "session",
      isTime: this.selectedTab === "time",
      isEncounters: this.selectedTab === "encounters",
      isInvestigation: this.selectedTab === "investigation"
    };
  }
  static async selectEditorTab(_event, button) {
    const tab = button.dataset.tab;
    if (!EDITOR_TABS.some(t => t.id === tab)) return;
    this.selectedTab = tab;
    await this.render();
  }
}
