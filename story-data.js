/**
 * THE KRAKEN'S CURSED TREASURE - STORY DATA
 * CEFR A1-A2 Level British English
 * Interactive Gamified Narrative Engine
 */

const VOCABULARY = {
  "traveller": {
    word: "traveller",
    type: "noun",
    def: "someone who visits and explores new places",
    example: "Daniel was a deep-sea traveller."
  },
  "deep sea": {
    word: "deep sea",
    type: "noun phrase",
    def: "the deep, dark water of the ocean",
    example: "He was exploring the deep sea."
  },
  "cave": {
    word: "cave",
    type: "noun",
    def: "a large open space inside rocks or underwater",
    example: "Daniel saw a dark underwater cave."
  },
  "treasure": {
    word: "treasure",
    type: "noun",
    def: "valuable things such as gold, coins, and gems",
    example: "He saw an old chest full of treasure."
  },
  "chest": {
    word: "chest",
    type: "noun",
    def: "a strong wooden or metal box for keeping valuables",
    example: "The chest was covered with gold."
  },
  "jewel": {
    word: "jewel",
    type: "noun",
    def: "a precious, shining stone",
    example: "He took only one small golden jewel."
  },
  "kraken": {
    word: "Kraken",
    type: "noun",
    def: "a huge, legendary sea creature with large tentacles",
    example: "A huge Kraken appeared behind him."
  },
  "guardian": {
    word: "guardian",
    type: "noun",
    def: "someone who protects a special place or thing",
    example: "The Kraken was the guardian of the treasure."
  },
  "attack": {
    word: "attack",
    type: "verb",
    def: "to try to hurt or fight someone",
    example: "The creature did not attack."
  },
  "protect": {
    word: "protect",
    type: "verb",
    def: "to keep someone or something safe from danger",
    example: "It was protecting the treasure from greed."
  },
  "curse": {
    word: "curse",
    type: "noun",
    def: "magic power that brings bad luck or changes someone",
    example: "The treasure had an ancient curse."
  },
  "escape": {
    word: "escape",
    type: "verb",
    def: "to get away safely from danger",
    example: "Daniel escaped alive from the cave."
  },
  "greed": {
    word: "greed",
    type: "noun",
    def: "wanting much more than you really need",
    example: "The Kraken protects the treasure from greed."
  },
  "symbol": {
    word: "symbol",
    type: "noun",
    def: "a picture, mark, or sign with a secret meaning",
    example: "He saw a glowing symbol on the wall."
  }
};

const STORY_NODES = {
  // SCENE 1 — THE DEEP SEA
  "scene-01": {
    id: "scene-01",
    chapter: 1,
    title: "Scene 1 — The Deep Sea",
    image: "images/scene-01.jpg",
    musicMood: "calm",
    xpReward: 15,
    text: [
      "Daniel was a deep-sea traveller.",
      "One day, he was exploring the deep sea.",
      "He was swimming near some large rocks when he saw a dark cave.",
      "Daniel looked at the cave.",
      "A strange golden light was coming from inside.",
      "\"What is that?\" he thought.",
      "He swam towards the cave."
    ],
    choices: [
      {
        text: "Enter the cave",
        next: "scene-02",
        icon: "cave",
        badge: "Courageous Explorer"
      }
    ]
  },

  // SCENE 2 — THE CAVE (Section 8: Take the treasure OR Leave the treasure)
  "scene-02": {
    id: "scene-02",
    chapter: 2,
    title: "Scene 2 — The Cave",
    image: "images/scene-02.jpg",
    musicMood: "mysterious",
    xpReward: 20,
    text: [
      "Daniel entered the cave.",
      "It was dark and quiet.",
      "He was using his torch.",
      "He was swimming slowly through the cave.",
      "Then he saw something on the floor.",
      "It was an old treasure chest.",
      "Daniel moved closer.",
      "The chest was covered with gold."
    ],
    choices: [
      {
        text: "Take the treasure",
        next: "scene-03",
        icon: "treasure",
        badge: "Gold Seeker"
      },
      {
        text: "Leave the treasure",
        next: "ending-leave",
        icon: "shield",
        danger: true,
        badge: "Cautious Diver"
      }
    ]
  },

  // SCENE 3 — THE TREASURE
  "scene-03": {
    id: "scene-03",
    chapter: 3,
    title: "Scene 3 — The Treasure",
    image: "images/scene-04.jpg",
    musicMood: "mysterious",
    xpReward: 20,
    text: [
      "Daniel looked at the golden chest.",
      "He wanted the treasure.",
      "He opened the chest.",
      "Gold coins and jewels were inside.",
      "Daniel smiled.",
      "\"I found it!\" he said.",
      "He took some of the treasure.",
      "Suddenly, the water began to move.",
      "Daniel looked behind him.",
      "Something very large was coming towards him."
    ],
    choices: [
      {
        text: "Look behind you",
        next: "scene-04",
        icon: "eye",
        badge: "Sudden Danger"
      }
    ]
  },

  // SCENE 4 — THE KRAKEN
  "scene-04": {
    id: "scene-04",
    chapter: 4,
    title: "Scene 4 — The Kraken",
    image: "images/scene-05.jpg",
    musicMood: "dramatic",
    xpReward: 25,
    text: [
      "A huge Kraken appeared.",
      "Daniel was shocked.",
      "The Kraken was protecting the treasure.",
      "It moved its long arms through the water.",
      "Daniel tried to swim away.",
      "But the Kraken followed him.",
      "Daniel dropped the treasure.",
      "The Kraken stopped.",
      "Daniel looked at it.",
      "He had two choices."
    ],
    choices: [
      {
        text: "Fight the Kraken",
        next: "scene-05",
        icon: "sword",
        danger: true,
        badge: "Brave Fighter"
      },
      {
        text: "Look for another way",
        next: "scene-06",
        icon: "search",
        wise: true,
        badge: "Wise Observer"
      }
    ]
  },

  // SCENE 5 — THE FIGHT (Leads to Cursed Guardian Ending)
  "scene-05": {
    id: "scene-05",
    chapter: 5,
    title: "Scene 5 — The Fight",
    image: "images/scene-06.jpg",
    musicMood: "dramatic",
    xpReward: 20,
    text: [
      "Daniel was afraid.",
      "But he wanted the treasure.",
      "He decided to fight the Kraken.",
      "The Kraken attacked.",
      "Daniel fought back.",
      "The battle was long.",
      "At last, Daniel defeated the Kraken.",
      "The cave became quiet.",
      "Daniel looked at the treasure.",
      "\"I won,\" he said.",
      "But then something strange happened.",
      "A dark light came from the Kraken.",
      "It moved towards Daniel.",
      "Daniel tried to swim away.",
      "But he could not move.",
      "The curse had found a new guardian.",
      "Daniel began to change.",
      "His arms became long.",
      "His eyes became bright.",
      "His body became huge.",
      "Daniel became the new Kraken."
    ],
    choices: [
      {
        text: "Face your fate",
        next: "ending-cursed",
        icon: "curse",
        danger: true,
        badge: "The New Guardian"
      }
    ]
  },

  // SCENE 6 — THE SECRET
  "scene-06": {
    id: "scene-06",
    chapter: 6,
    title: "Scene 6 — The Secret",
    image: "images/scene-07.jpg",
    musicMood: "mysterious",
    xpReward: 30,
    text: [
      "Daniel did not want to fight.",
      "He looked around the cave.",
      "He saw the treasure chest.",
      "Then he saw something strange on the wall.",
      "There was an old symbol.",
      "Daniel moved closer.",
      "The symbol began to glow.",
      "He saw a picture of a hand holding one small jewel.",
      "Then he understood.",
      "The Kraken was not protecting all the treasure from everyone.",
      "It was protecting the treasure from people who wanted to take everything.",
      "Daniel looked at the Kraken.",
      "The Kraken was watching him."
    ],
    choices: [
      {
        text: "Take one jewel",
        next: "scene-07",
        icon: "gem",
        wise: true,
        badge: "True Wisdom"
      },
      {
        text: "Take all the treasure",
        next: "scene-08",
        icon: "treasure",
        danger: true,
        badge: "Greedy Diver"
      }
    ]
  },

  // SCENE 7 — THE SAFE TREASURE (Section 12: Safe solution)
  "scene-07": {
    id: "scene-07",
    chapter: 7,
    title: "Scene 7 — The Safe Treasure",
    image: "images/scene-08.jpg",
    musicMood: "calm",
    xpReward: 35,
    text: [
      "Daniel slowly moved towards the treasure chest.",
      "He left the gold coins and the large jewels.",
      "He took only one small golden jewel.",
      "The Kraken watched him.",
      "It did not attack.",
      "Daniel waited.",
      "Nothing happened.",
      "The Kraken moved away from the cave entrance.",
      "Daniel understood.",
      "He had found the safe way.",
      "He did not need to take everything.",
      "He only needed one small treasure.",
      "Daniel smiled."
    ],
    choices: [
      {
        text: "Swim towards the surface",
        next: "scene-09",
        icon: "arrow-right",
        badge: "Guardian's Blessing"
      }
    ]
  },

  // SCENE 8 — GREED (Taking whole chest triggers attack)
  "scene-08": {
    id: "scene-08",
    chapter: 8,
    title: "Scene 8 — Greed",
    image: "images/scene-06.jpg",
    musicMood: "dramatic",
    xpReward: 15,
    text: [
      "Daniel looked at the treasure.",
      "He wanted more.",
      "He tried to take the whole chest.",
      "The Kraken became angry.",
      "Its large tentacles moved through the water.",
      "Daniel knew he had made a mistake.",
      "The Kraken attacked again.",
      "Daniel had only one choice."
    ],
    choices: [
      {
        text: "Fight",
        next: "scene-05",
        icon: "sword",
        danger: true,
        badge: "Desperate Fight"
      },
      {
        text: "Run",
        next: "ending-escape",
        icon: "run",
        badge: "Hasty Escape"
      }
    ]
  },

  // SCENE 9 — THE ESCAPE
  "scene-09": {
    id: "scene-09",
    chapter: 9,
    title: "Scene 9 — The Safe Return",
    image: "images/scene-09.jpg",
    musicMood: "calm",
    xpReward: 30,
    text: [
      "Daniel swam towards the cave entrance.",
      "He was holding only one golden jewel.",
      "The Kraken did not follow him.",
      "Daniel looked back.",
      "The Kraken was watching him from inside the cave.",
      "Daniel smiled.",
      "He had found the treasure.",
      "But he had not taken everything.",
      "He had respected the guardian.",
      "Daniel swam towards the sunlight."
    ],
    choices: [
      {
        text: "Reach the surface",
        next: "ending-success",
        icon: "sun",
        badge: "Master Adventurer"
      }
    ]
  },

  // ==========================================================================
  // ENDINGS
  // ==========================================================================

  // SUCCESS ENDING (Sections 12, 13, 14: MISSION COMPLETE)
  "ending-success": {
    id: "ending-success",
    type: "ending",
    isSuccess: true,
    title: "MISSION COMPLETE",
    subtitle: "The Safe Treasure",
    image: "images/scene-09.jpg",
    musicMood: "silent",
    xpReward: 50,
    badge: "MISSION COMPLETE",
    outcomeClass: "outcome-safe",
    storySummary: [
      "Daniel took only one jewel.",
      "The Kraken did not attack him.",
      "He left the treasure chest in the cave.",
      "Daniel swam back to the surface with one jewel.",
      "He completed his mission."
    ]
  },

  // LEAVE TREASURE ENDING (Section 9: MISSION NOT COMPLETE)
  "ending-leave": {
    id: "ending-leave",
    type: "ending",
    isSuccess: false,
    title: "MISSION NOT COMPLETE",
    subtitle: "You Left Without Treasure",
    image: "images/scene-02.jpg",
    musicMood: "silent",
    xpReward: 0,
    badge: "Left Empty-Handed",
    outcomeClass: "outcome-fail",
    storySummary: [
      "Daniel left the cave without the treasure.",
      "He was safe, but he did not complete his mission.",
      "You need to leave with a piece of treasure."
    ]
  },

  // CURSED ENDING (Section 11: MISSION NOT COMPLETE)
  "ending-cursed": {
    id: "ending-cursed",
    type: "ending",
    isSuccess: false,
    title: "MISSION NOT COMPLETE",
    subtitle: "The Cursed Guardian",
    image: "images/scene-10.jpg",
    musicMood: "silent",
    xpReward: 0,
    badge: "The Cursed Guardian",
    outcomeClass: "outcome-cursed",
    storySummary: [
      "Daniel fought and defeated the Kraken.",
      "But the treasure had an ancient curse.",
      "The dark curse moved to Daniel, and he became the new Kraken.",
      "The treasure belongs to the guardian of the cave.",
      "You did not complete your mission safely."
    ]
  },

  // ESCAPE ENDING (Section 11: MISSION NOT COMPLETE)
  "ending-escape": {
    id: "ending-escape",
    type: "ending",
    isSuccess: false,
    title: "MISSION NOT COMPLETE",
    subtitle: "You Lost The Treasure",
    image: "images/scene-06.jpg",
    musicMood: "silent",
    xpReward: 0,
    badge: "Fled In Fear",
    outcomeClass: "outcome-escape",
    storySummary: [
      "Daniel dropped the treasure and swam away as fast as he could.",
      "He reached the cave entrance safely, but he lost the treasure.",
      "The treasure belongs to the guardian.",
      "You need to take only what is safe to complete your mission."
    ]
  }
};
