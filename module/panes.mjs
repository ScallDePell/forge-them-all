/* Les panneaux latéraux d'une fenêtre à trois zones (navigation à gauche, catalogue à droite), repris de l'éditeur de
   feuille de Rule Them'All : la barre entre un panneau et la zone centrale se glisse pour régler la largeur du panneau
   (un double clic lui rend la sienne) et son bouton masque ou affiche le panneau. Chaque zone défile seule (CSS).
   Le choix de chaque utilisateur est gardé dans le navigateur, un par fenêtre (clé). root : [data-panes-root]. */
/** Les largeurs qu'un panneau peut prendre, en pixels ; la zone centrale garde toujours CENTER_MIN. */
export const PANE_LIMITS = Object.freeze({left: [160, 480], right: [180, 520]});
const CENTER_MIN = 280;
const BAR = 12;
const ICONS = {left: ["fa-angles-left", "fa-angles-right"], right: ["fa-angles-right", "fa-angles-left"]};
const NAMES = ["left", "right"];

const i18n = (key, fallback) => { const text = globalThis.game?.i18n?.localize?.(key); return text && text !== key ? text : fallback; };

export const clampWidth = (name, width) => Math.round(Math.min(PANE_LIMITS[name][1], Math.max(PANE_LIMITS[name][0], Number(width))));

/** Le choix gardé : {left: {width, hidden}, right: {width, hidden}} ; width null est la largeur propre du panneau. */
export function readPanes(key, storage = globalThis.localStorage) {
  let stored = null;
  try { stored = JSON.parse(storage?.getItem(key) ?? "null"); } catch { stored = null; }
  const pane = name => ({width: Number.isFinite(stored?.[name]?.width) ? clampWidth(name, stored[name].width) : null, hidden: stored?.[name]?.hidden === true});
  return {left: pane("left"), right: pane("right")};
}
function savePanes(key, panes, storage = globalThis.localStorage) { try { storage?.setItem(key, JSON.stringify(panes)); } catch { /* fenêtre privée : le choix dure le temps de la fenêtre */ } }

/** Montre le choix : les largeurs en variables CSS, un panneau masqué en classe, l'icône et le libellé de chaque bouton. */
export function applyPanes(root, panes) {
  for (const name of NAMES) {
    const {width, hidden} = panes[name];
    if (width === null) root.style.removeProperty(`--fta-${name}-width`); else root.style.setProperty(`--fta-${name}-width`, `${width}px`);
    root.classList.toggle(`fta-app--hide-${name}`, hidden);
    const label = hidden
      ? i18n(`FTA.Panes.Show.${name}`, name === "left" ? "Afficher la navigation" : "Afficher le catalogue")
      : i18n(`FTA.Panes.Hide.${name}`, name === "left" ? "Masquer la navigation" : "Masquer le catalogue");
    for (const button of root.querySelectorAll(`[data-pane-toggle="${name}"]`)) {
      button.title = label; button.setAttribute("aria-label", label); button.setAttribute("aria-expanded", String(!hidden));
      button.querySelector("i")?.classList.remove(...ICONS[name]);
      button.querySelector("i")?.classList.add(ICONS[name][hidden ? 1 : 0]);
    }
  }
}

/** La largeur la plus grande que le panneau peut prendre sans écraser la zone centrale. */
function roomFor(name, panes, box) {
  const other = name === "left" ? "right" : "left";
  const otherWidth = panes[other].hidden ? 0 : (panes[other].width ?? PANE_LIMITS[other][0]);
  return box.width - otherWidth - 2 * BAR - CENTER_MIN;
}

export function installPanes(root, key, {storage = globalThis.localStorage} = {}) {
  let panes = readPanes(key, storage);
  applyPanes(root, panes);
  const keep = next => { panes = next; applyPanes(root, panes); savePanes(key, panes, storage); };
  for (const bar of root.querySelectorAll("[data-pane-resizer]")) {
    const name = bar.dataset.paneResizer;
    if (!NAMES.includes(name)) continue;
    bar.querySelector("[data-pane-toggle]")?.addEventListener("click", () => keep({...panes, [name]: {...panes[name], hidden: !panes[name].hidden}}));
    bar.addEventListener("dblclick", event => { if (!event.target.closest("[data-pane-toggle]")) keep({...panes, [name]: {width: null, hidden: false}}); });
    bar.addEventListener("pointerdown", event => {
      if (event.button !== 0 || event.target.closest("[data-pane-toggle]") || panes[name].hidden) return;
      event.preventDefault();
      bar.setPointerCapture?.(event.pointerId);
      bar.dataset.paneDragging = "";
      const box = (bar.closest("[data-panes]") ?? root).getBoundingClientRect();
      const move = e => {
        const wanted = name === "left" ? e.clientX - box.left : box.right - e.clientX;
        const width = clampWidth(name, Math.min(wanted, Math.max(PANE_LIMITS[name][0], roomFor(name, panes, box))));
        panes = {...panes, [name]: {...panes[name], width}};
        applyPanes(root, panes);
      };
      const end = () => {
        delete bar.dataset.paneDragging;
        bar.removeEventListener("pointermove", move); bar.removeEventListener("pointerup", end); bar.removeEventListener("pointercancel", end);
        savePanes(key, panes, storage);
      };
      bar.addEventListener("pointermove", move); bar.addEventListener("pointerup", end); bar.addEventListener("pointercancel", end);
    });
    // Au clavier : flèches gauche/droite pour 16 px, Entrée pour masquer ou afficher.
    bar.addEventListener("keydown", event => {
      if (event.target.closest("[data-pane-toggle]")) return;
      const step = {ArrowLeft: -16, ArrowRight: 16}[event.key];
      if (!step || panes[name].hidden) return;
      event.preventDefault();
      const current = panes[name].width ?? (bar.closest("[data-panes]")?.querySelector(`.fta-pane--${name}`)?.getBoundingClientRect().width ?? PANE_LIMITS[name][0]);
      keep({...panes, [name]: {...panes[name], width: clampWidth(name, current + (name === "left" ? step : -step))}});
    });
  }
}
