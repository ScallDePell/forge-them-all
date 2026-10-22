# Forge Them'All — socle Foundry v14 — v0.0.3

## Changements v0.0.3
- **Identité visuelle de Rule Them'All** : échelle d'espacements, typographie, couleurs (suivant le thème Foundry), onglets façon explorateur, cadres, tuiles 282 × 94, badges et bascule tuiles/lignes reprises de RTA v1.0.20 sous le préfixe `--fta-` (`styles/tokens.css`, `layout.css`, `components.css`). Aucun CSS de l'ancien RWF v0.1.475.
- **Trois zones à défilement indépendant** (accueil Fantaisies et Campagnes, éditeur) : navigation à gauche, élément au centre, catalogue à droite ; l'en-tête et les onglets restent visibles.
- **Panneaux gauche et droit réglables en largeur** comme l'éditeur de feuille de RTA : glisser la barre, double clic pour la largeur d'origine, bouton pour masquer/afficher, flèches du clavier. Choix gardé par utilisateur dans le navigateur, un par fenêtre (`module/panes.mjs`). Fenêtre étroite (< 640 px) : les trois zones s'empilent dans un seul défilement.
- **Onglets natifs ApplicationV2** (`data-action="tab"`, `changeTab`) : changer d'onglet ne reconstruit plus la fenêtre et garde le défilement.
- Libellés dans `lang/fr.json` ; l'éditeur reçoit un mode `source` / `instance` (badge, barre des PJ en instance) ; le catalogue n'affiche les Fantaisies que si elles sont activées ; changer le réglage rafraîchit les fenêtres ouvertes.

## Changements v0.0.2
Renommage du module « Atelier du MJ » en **Forge Them'All** : id `forge-them-all` (ancien `atelier-du-mj`), dossier `forge-them-all/`, API `game.forgeThemAll` (ancienne `game.atelierMJ`). Aucun autre changement fonctionnel. Les réglages enregistrés sous l'ancien id ne sont pas repris (prototype sans données).

## Statut
Prototype de structure et de navigation, non fonctionnel métier.
Toutes les fenêtres héritent de `HandlebarsApplicationMixin(ApplicationV2)`. Le CSS se limite à la mise en page et à l'identité visuelle de Rule Them'All ; les champs et boutons restent ceux de Foundry.

## Installation locale
Décompresser l'archive dans `Data/modules/` pour obtenir `Data/modules/forge-them-all/module.json`.
Activer le module depuis la gestion des modules d'un monde Foundry v14.
Le système de jeu actif peut être RWF ou un autre système.

## Ouvrir
MJ : créer une macro *Script* contenant `game.forgeThemAll.open();`, puis l'exécuter.
Un bouton de commodité est ajouté au répertoire des Journaux si le hook natif `renderJournalDirectory` est exécuté sur l'installation.

## Navigation
- Accueil : Fantaisies / Bibliothèque de scénarios / Gestion des campagnes.
- Depuis Bibliothèque ou Campagnes : bouton ouvrant **une fenêtre indépendante** de l'éditeur.
- Éditeur : Écriture / Cartes / Partie / Temps / Rencontres / Enquête & Pistes.
- Panneaux : navigation gauche / zone centrale / catalogue droit, chacun avec son propre défilement ; gauche et droit réglables en largeur et masquables.

## Paramètres
`Activer les Fantaisies` (world, MJ), activé par défaut. Aucun autre domaine métier n'est désactivable.
Le dernier onglet d'accueil est mémorisé en réglage client (aucune donnée sensible).

## Interfaces
`game.forgeThemAll.open()` ; `game.forgeThemAll.getRuleThemAll()` ; `game.forgeThemAll.fantasiesEnabled`.
Rule Them'All est recommandé, mais absent => accès aux autres fonctionnalités conservé.
Le branchement au catalogue Fantaisies attend un **contrat public vérifié** ; aucune lecture de structures privées.

## Hors périmètre v0.0.3
Scénarios persistés ; campagnes ; dossiers ; catalogue ; glisser-déposer ; gestion des droits et secrets ; horloge ; moteur de puissance ; tokenisation et combats ; révélations ; synchronisation RTA.
**Ne pas utiliser le prototype comme stockage de données de jeu** : les affichages sont non connectés.

## Vérifications manuelles dans Foundry v14
1. Installer et activer le module avec un système autre que RWF.
2. Ouvrir la fenêtre avec `game.forgeThemAll.open()` et naviguer dans les trois sections.
3. Ouvrir l'éditeur depuis Bibliothèque ; naviguer dans les six onglets.
4. Désactiver Fantaisies dans les paramètres du module ; les deux autres sections restent accessibles.
5. Tester avec et sans Rule Them'All actif.
6. Vérifier qu'aucun changement de scène, de token, de combat ou de donnée n'a lieu.
7. Glisser les barres des panneaux, double-cliquer, masquer/afficher ; fermer et rouvrir : les largeurs sont conservées.
8. Réduire la fenêtre sous 640 px de large : les zones s'empilent.

## Limites de validation
Structure ZIP et syntaxe JS vérifiables statiquement ; lancement UI réel et compatibilité des hooks nécessitent un test dans Foundry v14.
