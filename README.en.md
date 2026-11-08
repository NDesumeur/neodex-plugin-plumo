# Plumo

A one-button skill game: fly a little bird between stone columns. It falls on its own, and each wing flap lifts it up. Get past as many columns as you can and earn medals.

*Version française : [README.md](README.md)*

## Controls

- **Click**, **Space**, **↑** or **Enter**: one wing flap, giving an upward push.
- **P**: pause; a click resumes.
- After a fall, a click starts a new game.

## Rules

- The bird keeps falling: flap at the right rhythm to get through the gap in each column.
- Touching a column or the ground ends the game.
- Each column passed is worth 1 point.
- The gaps narrow little by little (by about a third after forty or so points) and the bird goes faster and faster, more than half as fast again at 60 points.

## The sky

The scenery changes every 25 points: day, evening, starry night, then dawn, and the cycle starts over.

## Medals

At the end of each game, a medal based on your score: **bronze** at 10 points, **silver** at 25, **gold** at 50, **platinum** at 100. The medals panel counts how many of each kind you have earned.

## Statistics

Best score, number of games and total wing flaps.

## Data and sync

Your record, medals and statistics are stored by NeoDex, backed up and synced between your PCs when sync is on.

## Install

In NeoDex: **NeoStore → Discover → Plumo → Install**.

Building a plugin: see the [NeoDex SDK](https://github.com/NDesumeur/neodex-sdk).
