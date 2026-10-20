# RWF — Atelier du MJ

Futur module **Foundry VTT v14** destiné au meneur de jeu : préparation et conduite de campagnes et de scénarios, suivi du temps, estimation des rencontres et gestion des révélations faites aux joueurs.

> **Statut : conception.** Aucune ligne de code n'est encore écrite. Le module reprend les idées de l'ancien Atelier intégré au système Real World Fantasy (v0.1.451 / v0.1.475), mais il est reconstruit de zéro et ne dépend plus du système de jeu actif.

## Principes

- **Module autonome**, basé sur les composants natifs de Foundry v14 (ApplicationV2, DialogV2). Le CSS historique n'est pas repris.
- **Bibliothèque et campagnes.** Un scénario *source* vit dans la bibliothèque. L'ajouter à une campagne crée une *instance* autonome : une seule par campagne, et sans effet en retour sur la source.
- **Continuité de campagne.** Chaque PNJ ou objet a une seule identité persistante d'un scénario à l'autre. Il n'y a jamais de rapprochement par le seul nom.
- **Structure libre.** Les actes et les dossiers sont facultatifs, et l'on peut créer une scène improvisée en une action.
- **Rien d'automatique sans le MJ.** Aucune révélation, aucun combat lancé ni aucun effet temporel appliqué sans prévisualisation et confirmation.
- **Secrets protégés côté serveur.** Un joueur ne reçoit que les données auxquelles il a droit : masquer du HTML ne suffit pas.

## Interface

L'Atelier principal propose trois espaces : **Fantaisies**, **Bibliothèque de scénarios** et **Gestion des campagnes**.

L'éditeur de scénario est le même pour les sources et les instances. Il comporte trois panneaux (dossiers, élément édité, catalogue de ressources) et six onglets :

| Onglet | Rôle |
|---|---|
| **Écriture** | Scènes narratives : déroulement, notes privées du MJ, texte joueurs, supports visuels |
| **Cartes** | Plans, images et Scenes Foundry associés à 0..N scènes |
| **Partie** | Conduite de séance : scène en cours, notes rapides, événements consignés |
| **Temps** | Horloge « MAINTENANT » de campagne, calendrier adaptable, échéances et effets à confirmer |
| **Rencontres** | Calculateur de puissance et de menace, puis commande « Mettre en scène » (tokens et combat préparés, sans démarrage) |
| **Enquête & Pistes** | Faits révélables, révélations ciblées par PJ, matrice des connaissances, journal de provenance |

## Carnet d'enquête des PJ

C'est l'interface côté joueurs, séparée de l'Atelier. Elle a quatre onglets : *Enquête & Pistes* (un tableau collaboratif unique par campagne, avec des positions propres à chaque joueur), *Contacts*, *Indices & Documents* et *Chronologie*. Les notes et les hypothèses sont privées par défaut et ne deviennent jamais la vérité du MJ. Le MJ les consulte en lecture seule.

## Intégration Rule Them'All

Rule Them'All reste propriétaire de la création et de la synchronisation des contenus (Actors, Items, Fantaisies, compendiums). L'Atelier lui demande un import sélectif : il simule d'abord, puis applique après confirmation, de façon atomique et idempotente. Les contenus restent locaux au scénario jusqu'à une publication volontaire. Une mise à jour externe produit toujours un diff, jamais un écrasement silencieux.

## Feuille de route

1. **Socle et preuves de concept v14** : persistance, projection sécurisée, fenêtres natives, tokens et combats.
2. **Données** : campagnes, scénarios, ressources, idempotence.
3. **Écriture, Cartes, Partie.**
4. **Temps.**
5. **Rencontres** et « Mettre en scène ».
6. **Enquête et Carnet des joueurs.**
7. **Intégration Rule Them'All.**
8. **Recette** multi-utilisateurs et non-régression.

## Documents de conception

- Audit historique et architecture cible (source v0.1.451)
- Atlas de structure des fenêtres v0.4 (source v0.1.475)
- Contrats techniques d'implémentation v0.1
- Consolidation fonctionnelle des six onglets
- Carnet d'enquête des PJ, référentiel technique v0.1
- Rule Them'All, exigences et contrat d'intégration v0.1
