# Plumo

Un jeu d'adresse à une touche : fais voler un petit oiseau entre des colonnes de pierre. Il retombe tout seul, chaque battement d'ailes le fait remonter. Passe le plus de colonnes possible et gagne des médailles.

*English version: [README.en.md](README.en.md)*

## Commandes

- **Clic**, **Espace**, **↑** ou **Entrée** : un battement d'ailes, qui donne une impulsion vers le haut.
- **P** : pause ; un clic reprend.
- Après une chute, un clic relance une partie.

## Règles

- L'oiseau tombe sans arrêt : il faut battre des ailes au bon rythme pour passer dans l'ouverture de chaque colonne.
- Toucher une colonne ou le sol termine la partie.
- Chaque colonne passée vaut 1 point.
- Les ouvertures se resserrent petit à petit (d'environ un tiers au bout d'une quarantaine de points) et l'oiseau va de plus en plus vite, jusqu'à plus de moitié plus vite à 60 points.

## Le ciel

Le décor change tous les 25 points : jour, soir, nuit étoilée puis aube, et le cycle recommence.

## Médailles

À la fin de chaque partie, une médaille selon ton score : **bronze** à 10 points, **argent** à 25, **or** à 50, **platine** à 100. Le panneau des médailles compte combien tu en as gagné de chaque sorte.

## Statistiques

Meilleur score, nombre de parties et battements d'ailes au total.

## Données et synchronisation

Ton record, tes médailles et tes statistiques sont enregistrés par NeoDex, sauvegardés et synchronisés entre tes PC si la synchro est activée.

## Installer

Dans NeoDex : **NeoStore → À découvrir → Plumo → Installer**.

Développer un plugin : voir le [SDK NeoDex](https://github.com/NDesumeur/neodex-sdk).
