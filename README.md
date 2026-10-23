# The Kraken's Cursed Treasure 🌊🪙

An interactive, cinematic gamified adventure story designed for **English language learners at CEFR A1–A2 level**, written in **British English**.

---

## 📖 Story Overview

You play as **Daniel**, a young deep-sea traveller exploring mysterious ocean depths. Deep inside an underwater cavern, Daniel discovers an ancient treasure chest guarded by an enormous, intelligent **Kraken**.

The player initially believes the treasure is cursed. However, the twist reveals that the Kraken is protecting the treasure from **greed**. Taking the entire chest results in danger, while taking only **one golden jewel** reveals respect for the guardian and allows Daniel to return safely to the surface.

### 🧭 Story Paths & Endings

1. **Mission Complete — The Safe Treasure (Safe Ending)**: Daniel discovers the glowing wall symbols, respects the ancient guardian, takes only one jewel, and escapes safely.
2. **Mission Not Complete — Left Empty-Handed**: Daniel leaves the cave without any treasure.
3. **Mission Not Complete — The Cursed Guardian**: Daniel fights and defeats the Kraken, but the ancient curse transfers to him, turning Daniel into the new eternal guardian.
4. **Mission Not Complete — Lost the Treasure**: Daniel attempts to take the whole chest, the Kraken attacks, and Daniel flees with empty hands.

---

## ✨ Features

- **Continuous Narrative Stream**: Each scene and choice is appended downward smoothly into a dedicated story stream with automatic scroll positioning (`scroll-margin-top: 90px`).
- **10 Cinematic 16:9 Landscape Illustrations**: Visually consistent character design for Daniel, underwater environments, and the majestic Kraken.
- **CEFR A1–A2 British English**: Natural integration of Past Simple and Past Continuous grammar.
- **Interactive Vocabulary Tooltip**: Instant definitions and British English speech synthesis pronunciation for 14 target words: *traveller, deep sea, cave, treasure, chest, jewel, Kraken, guardian, attack, protect, curse, escape, greed, symbol*.
- **British English Audio Narration**: Listen button on every scene for pronunciation practice.
- **Atmospheric Background Music & Web Audio SFX**: Audio loops smoothly during gameplay, dynamically adjusts during tense Kraken encounters, and stops completely on all endings.
- **Double-Click & Re-Click Protection**: Immediate button disabling and transition locks to prevent duplicate scenes or state corruption.
- **XP & Achievement Badges**: Gamified rewards tracking progress throughout the adventure.

---

## 🚀 How to Run

Simply clone or download this repository and open `index.html` in any modern web browser:

```bash
git clone https://github.com/Joyal520/The-Guardian-of-the-treasure.git
cd The-Guardian-of-the-treasure
start index.html
```

---

## 📁 Repository Structure

```
The Guardian of the treasure/
├── index.html          # Main HTML structure with fixed header, start view, and story container
├── styles.css          # Cinematic theme, responsive rules, animations
├── story-data.js       # Structured state machine, scenes, choices, vocabulary
├── game.js             # Game loop, audio engine, speech synthesis, particle system
├── README.md           # Project documentation
├── audio/
│   └── bgm.mp3         # Atmospheric background music
└── images/
    ├── scene-01.jpg to scene-10.jpg   # 16:9 cinematic illustrations
    └── fallback.jpg                   # Safe layout image fallback
```
