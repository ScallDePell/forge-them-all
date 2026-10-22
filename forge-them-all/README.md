# Forge Them'All — socle Foundry v14 — v0.0.2

## Changements v0.0.2
Renommage du module « Atelier du MJ » en **Forge Them'All** : id `forge-them-all` (ancien `atelier-du-mj`), dossier `forge-them-all/`, API `game.forgeThemAll` (ancienne `game.atelierMJ`). Aucun autre changement fonctionnel. Les réglages enregistrés sous l'ancien id ne sont pas repris (prototype sans données).

## Statut
Prototype de structure et de navigation, non fonctionnel métier, **sans aucun CSS personnalisé**.
Toutes les fenêtres héritent de `HandlebarsApplicationMixin(ApplicationV2)` et utilisent des éléments HTML natifs rendus par Foundry.
Pas de `styles`, pas de fichier `.css`, pas de styles inline, pas de classes CSS spécifiques.

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
- Panneaux : navigation gauche / zone centrale / catalogue droit (mise en page native rudimentaire par tableau temporaire).

## Paramètres
`Activer les Fantaisies` (world, MJ), activé par défaut. Aucun autre domaine métier n'est désactivable.
Le dernier onglet d'accueil est mémorisé en réglage client (aucune donnée sensible).

## Interfaces
`game.forgeThemAll.open()` ; `game.forgeThemAll.getRuleThemAll()` ; `game.forgeThemAll.fantasiesEnabled`.
Rule Them'All est recommandé, mais absent => accès aux autres fonctionnalités conservé.
Le branchement au catalogue Fantaisies attend un **contrat public vérifié** ; aucune lecture de structures privées.

## Hors périmètre v0.0.2
Scénarios persistés ; campagnes ; dossiers ; catalogue ; glisser-déposer ; gestion des droits et secrets ; horloge ; moteur de puissance ; tokenisation et combats ; révélations ; synchronisation RTA.
**Ne pas utiliser le prototype comme stockage de données de jeu** : les affichages sont non connectés.

## Vérifications manuelles dans Foundry v14
1. Installer et activer le module avec un système autre que RWF.
2. Ouvrir la fenêtre avec `game.forgeThemAll.open()` et naviguer dans les trois sections.
3. Ouvrir l'éditeur depuis Bibliothèque ; naviguer dans les six onglets.
4. Désactiver Fantaisies dans les paramètres du module ; les deux autres sections restent accessibles.
5. Tester avec et sans Rule Them'All actif.
6. Vérifier qu'aucun changement de scène, de token, de combat ou de donnée n'a lieu.

## Limites de validation
Structure ZIP et syntaxe JS vérifiables statiquement ; lancement UI réel et compatibilité des hooks nécessitent un test dans Foundry v14.
