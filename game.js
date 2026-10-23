/**
 * THE KRAKEN'S CURSED TREASURE - GAME ENGINE
 * Interactive Gamified Narrative Engine
 * Continuous Story Stream Architecture
 * CEFR A1-A2 Level British English
 */

(function () {
  'use strict';

  // ==========================================================================
  // GAME STATE
  // ==========================================================================
  const gameState = {
    currentScene: "scene-01",
    ending: null,
    musicPlaying: false,
    xp: 0,
    visitedScenes: new Set(),
    unlockedBadges: new Set(),
    learnedWords: new Set(),
    isMuted: false,
    activeSpeakingBtn: null
  };

  // Transition lock to prevent duplicate scenes & rapid clicking (Section 19 & 20)
  let isTransitioning = false;

  // Target vocabulary words to highlight
  const TARGET_WORDS = [
    "deep sea", "traveller", "kraken", "treasure", "guardian",
    "protect", "attack", "curse", "escape", "greed", "symbol",
    "chest", "jewel", "cave"
  ];

  // ==========================================================================
  // AUDIO CONTROLLER (Web Audio + HTML5 Single Audio Instance)
  // ==========================================================================
  class AudioManager {
    constructor() {
      this.bgm = new Audio('audio/bgm.mp3');
      this.bgm.loop = true;
      this.bgm.preload = 'auto';
      this.currentVolume = 0.22;
      this.bgm.volume = this.currentVolume;

      this.bgm.onerror = () => {
        console.warn("Background audio 'audio/bgm.mp3' not found or blocked. Ambient synthesizer active.");
      };

      this.audioCtx = null;
    }

    initContext() {
      if (!this.audioCtx) {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (AudioContext) {
          this.audioCtx = new AudioContext();
        }
      }
      if (this.audioCtx && this.audioCtx.state === 'suspended') {
        this.audioCtx.resume();
      }
    }

    startBGM() {
      this.initContext();
      if (gameState.isMuted) return;

      this.bgm.volume = this.currentVolume;
      const playPromise = this.bgm.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            gameState.musicPlaying = true;
            this.updateAudioToggleIcon();
          })
          .catch(err => {
            console.log("Audio autoplay waiting for user interaction:", err);
          });
      }
    }

    stopBGM() {
      // MASTER RULE (Section 17): Stop music completely when game ends
      try {
        this.bgm.pause();
        this.bgm.currentTime = 0;
      } catch (e) {
        console.error("Error stopping BGM:", e);
      }
      gameState.musicPlaying = false;
      this.updateAudioToggleIcon();
    }

    setMood(mood) {
      if (mood === 'silent') {
        this.stopBGM();
        return;
      }

      if (!gameState.musicPlaying && !gameState.isMuted) {
        this.startBGM();
      }

      if (gameState.isMuted) return;

      let targetVol = 0.22;
      if (mood === 'dramatic') {
        targetVol = 0.38;
      } else if (mood === 'mysterious') {
        targetVol = 0.26;
      } else if (mood === 'calm') {
        targetVol = 0.20;
      }

      this.currentVolume = targetVol;
      this.fadeVolume(targetVol, 350);
    }

    fadeVolume(target, durationMs) {
      const start = this.bgm.volume;
      const stepTime = 50;
      const steps = durationMs / stepTime;
      const diff = (target - start) / steps;
      let count = 0;

      const timer = setInterval(() => {
        count++;
        const newVol = Math.max(0, Math.min(1, start + diff * count));
        this.bgm.volume = newVol;
        if (count >= steps) {
          clearInterval(timer);
          this.bgm.volume = target;
        }
      }, stepTime);
    }

    toggleMute() {
      this.initContext();
      gameState.isMuted = !gameState.isMuted;
      if (gameState.isMuted) {
        this.bgm.volume = 0;
        this.bgm.pause();
      } else {
        this.bgm.volume = this.currentVolume;
        if (gameState.currentScene && !gameState.ending) {
          this.bgm.play().catch(e => console.log(e));
          gameState.musicPlaying = true;
        }
      }
      this.updateAudioToggleIcon();
    }

    updateAudioToggleIcon() {
      const btn = document.getElementById('audio-toggle-btn');
      if (!btn) return;
      if (gameState.isMuted) {
        btn.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="1" y1="1" x2="23" y2="23"></line><path d="M9 9v3a3 3 0 0 0 5.12 2.12M15 9.34V4a3 3 0 0 0-5.94-.6"></path><path d="M17 16.95A7 7 0 0 1 5 12v-2m14 0v2a7 7 0 0 1-.11 1.23"></path></svg>`;
        btn.classList.add('muted');
        btn.title = "Unmute Background Music";
      } else {
        btn.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 18V5l12-2v13"></path><circle cx="6" cy="18" r="3"></circle><circle cx="18" cy="16" r="3"></circle></svg>`;
        btn.classList.remove('muted');
        btn.title = "Mute Background Music";
      }
    }

    playBubbleSound() {
      if (gameState.isMuted || !this.audioCtx) return;
      try {
        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();
        osc.type = 'sine';
        const now = this.audioCtx.currentTime;
        osc.frequency.setValueAtTime(380, now);
        osc.frequency.exponentialRampToValueAtTime(750, now + 0.12);
        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);
        osc.connect(gain);
        gain.connect(this.audioCtx.destination);
        osc.start(now);
        osc.stop(now + 0.15);
      } catch (e) { }
    }

    playChimeSound() {
      if (gameState.isMuted || !this.audioCtx) return;
      try {
        const notes = [523.25, 659.25, 783.99, 1046.50];
        notes.forEach((freq, idx) => {
          const osc = this.audioCtx.createOscillator();
          const gain = this.audioCtx.createGain();
          osc.type = 'triangle';
          const now = this.audioCtx.currentTime + idx * 0.08;
          osc.frequency.setValueAtTime(freq, now);
          gain.gain.setValueAtTime(0.14, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
          osc.connect(gain);
          gain.connect(this.audioCtx.destination);
          osc.start(now);
          osc.stop(now + 0.4);
        });
      } catch (e) { }
    }

    playTensionSound() {
      if (gameState.isMuted || !this.audioCtx) return;
      try {
        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();
        osc.type = 'sawtooth';
        const now = this.audioCtx.currentTime;
        osc.frequency.setValueAtTime(95, now);
        osc.frequency.exponentialRampToValueAtTime(65, now + 0.8);
        gain.gain.setValueAtTime(0.18, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.85);
        osc.connect(gain);
        gain.connect(this.audioCtx.destination);
        osc.start(now);
        osc.stop(now + 0.9);
      } catch (e) { }
    }
  }

  const audio = new AudioManager();

  // ==========================================================================
  // BRITISH ENGLISH SPEECH SYNTHESIS
  // ==========================================================================
  function speakBritishText(text, onComplete) {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-GB';
    utterance.rate = 0.88;
    utterance.pitch = 1.0;

    const voices = window.speechSynthesis.getVoices();
    const gbVoice = voices.find(v => v.lang.includes('en-GB') || v.lang.includes('en_GB'));
    if (gbVoice) {
      utterance.voice = gbVoice;
    }

    if (onComplete) {
      utterance.onend = onComplete;
      utterance.onerror = onComplete;
    }

    window.speechSynthesis.speak(utterance);
  }

  if ('speechSynthesis' in window) {
    window.speechSynthesis.onvoiceschanged = () => {
      window.speechSynthesis.getVoices();
    };
  }

  // ==========================================================================
  // VOCABULARY HIGHLIGHTING ENGINE
  // ==========================================================================
  function highlightVocabulary(text) {
    const sorted = [...TARGET_WORDS].sort((a, b) => b.length - a.length);
    let result = text;

    sorted.forEach(wordKey => {
      let regexPattern = `\\b(${wordKey})(s|ed|ing|d)?\\b`;
      if (wordKey === "deep sea") {
        regexPattern = `\\b(deep-sea|deep sea)\\b`;
      }

      const regex = new RegExp(regexPattern, 'gi');
      result = result.replace(regex, (match) => {
        return `<span class="vocab-word" data-word="${wordKey.toLowerCase()}">${match}</span>`;
      });
    });

    return result;
  }

  function showVocabModal(wordKey) {
    const data = VOCABULARY[wordKey.toLowerCase()];
    if (!data) return;

    audio.playBubbleSound();
    gameState.learnedWords.add(wordKey.toLowerCase());
    updateStatsPills();

    const backdrop = document.getElementById('vocab-modal');
    const wordEl = document.getElementById('modal-word');
    const posEl = document.getElementById('modal-pos');
    const defEl = document.getElementById('modal-def');
    const exEl = document.getElementById('modal-example');

    wordEl.textContent = data.word;
    posEl.textContent = data.type;
    defEl.textContent = data.def;
    exEl.textContent = `"${data.example}"`;

    backdrop.classList.add('active');
    speakBritishText(data.word);
  }

  function hideVocabModal() {
    const backdrop = document.getElementById('vocab-modal');
    if (backdrop) backdrop.classList.remove('active');
  }

  // ==========================================================================
  // SCENE CREATION & CONTINUOUS STREAM (Section 1, 2, 3, 4, 5, 6)
  // ==========================================================================
  function getChoiceIcon(iconType) {
    switch (iconType) {
      case 'cave': return '🌊';
      case 'treasure': return '🪙';
      case 'shield': return '🛡️';
      case 'eye': return '👁️';
      case 'sword': return '⚔️';
      case 'search': return '🔍';
      case 'gem': return '💎';
      case 'run': return '⚡';
      case 'sun': return '☀️';
      case 'curse': return '🔮';
      case 'trophy': return '🏆';
      default: return '👉';
    }
  }

  function createSceneElement(node) {
    const sceneSection = document.createElement('section');
    sceneSection.className = 'story-scene';
    sceneSection.id = `scene-${node.id}`;

    // 1. SCENE IMAGE (Section 5: ALWAYS before reading text)
    const imageContainer = document.createElement('div');
    imageContainer.className = 'scene-image-container';

    const img = document.createElement('img');
    img.className = 'scene-image';
    img.src = node.image;
    img.alt = node.title || "Scene illustration";
    img.onerror = () => handleImageError(img);

    const badge = document.createElement('div');
    badge.className = 'scene-badge';
    badge.textContent = `Scene 0${node.chapter}`;

    const listenBtn = document.createElement('button');
    listenBtn.className = 'narration-btn';
    listenBtn.setAttribute('title', 'Listen to narration in British English');
    listenBtn.innerHTML = `
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
        <path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>
      </svg>
      <span>Listen</span>
    `;

    listenBtn.addEventListener('click', () => {
      toggleSceneNarration(node.text.join(' '), listenBtn);
    });

    imageContainer.appendChild(img);
    imageContainer.appendChild(badge);
    imageContainer.appendChild(listenBtn);
    sceneSection.appendChild(imageContainer);

    // 2. SCENE CONTENT (Title + Text + Choices)
    const contentCard = document.createElement('div');
    contentCard.className = 'scene-content-card';

    const headerRow = document.createElement('div');
    headerRow.className = 'scene-header-row';

    const titleEl = document.createElement('h2');
    titleEl.className = 'scene-title';
    titleEl.textContent = node.title;

    const tipBadge = document.createElement('div');
    tipBadge.className = 'learner-tip-badge';
    tipBadge.innerHTML = `<span>💡 Tip:</span> Click blue words for meanings`;

    headerRow.appendChild(titleEl);
    headerRow.appendChild(tipBadge);
    contentCard.appendChild(headerRow);

    // Story Text Paragraphs
    const textContainer = document.createElement('div');
    textContainer.className = 'story-text-container';
    node.text.forEach(paragraph => {
      const p = document.createElement('p');
      p.innerHTML = highlightVocabulary(paragraph);
      textContainer.appendChild(p);
    });
    contentCard.appendChild(textContainer);

    // Choices Container
    const choicesContainer = document.createElement('div');
    choicesContainer.className = 'choices-container';

    node.choices.forEach(choice => {
      const btn = document.createElement('button');
      btn.className = 'choice-btn';
      if (choice.danger) btn.classList.add('choice-danger');
      if (choice.wise) btn.classList.add('choice-wise');

      btn.innerHTML = `
        <div class="choice-btn-content">
          <span class="choice-icon">${getChoiceIcon(choice.icon)}</span>
          <span>${choice.text}</span>
        </div>
        <span class="choice-arrow">→</span>
      `;

      btn.addEventListener('click', () => {
        handleChoiceClick(choice, btn, choicesContainer);
      });

      choicesContainer.appendChild(btn);
    });

    contentCard.appendChild(choicesContainer);
    sceneSection.appendChild(contentCard);

    return { element: sceneSection, imgElement: img };
  }

  function createEndingElement(endingNode) {
    const endingSection = document.createElement('section');
    endingSection.className = 'story-scene ending-scene';
    endingSection.id = `scene-${endingNode.id}`;

    // 1. Image
    const imageContainer = document.createElement('div');
    imageContainer.className = 'scene-image-container';

    const img = document.createElement('img');
    img.className = 'scene-image';
    img.src = endingNode.image;
    img.alt = endingNode.title;
    img.onerror = () => handleImageError(img);

    imageContainer.appendChild(img);
    endingSection.appendChild(imageContainer);

    // 2. Ending Card
    const card = document.createElement('div');
    card.className = `end-card ${endingNode.outcomeClass}`;

    const badge = document.createElement('div');
    badge.className = 'ending-badge-pill';
    badge.textContent = endingNode.badge;

    const titleEl = document.createElement('h1');
    titleEl.className = 'ending-title';
    titleEl.textContent = endingNode.title;

    const subtitleEl = document.createElement('h3');
    subtitleEl.className = 'ending-subtitle';
    subtitleEl.textContent = endingNode.subtitle;

    const summaryContainer = document.createElement('div');
    summaryContainer.className = 'ending-story-summary';
    endingNode.storySummary.forEach(paragraph => {
      const p = document.createElement('p');
      p.innerHTML = highlightVocabulary(paragraph);
      summaryContainer.appendChild(p);
    });

    card.appendChild(badge);
    card.appendChild(titleEl);
    card.appendChild(subtitleEl);
    card.appendChild(summaryContainer);

    if (endingNode.isSuccess) {
      // SUCCESS STATS GRID (Section 13)
      const statsGrid = document.createElement('div');
      statsGrid.className = 'ending-stats-grid';
      statsGrid.innerHTML = `
        <div class="stat-item">
          <div class="stat-item-label">Status</div>
          <div class="stat-item-val gold">MISSION COMPLETE</div>
        </div>
        <div class="stat-item">
          <div class="stat-item-label">Treasure Taken</div>
          <div class="stat-item-val gold">1 JEWEL</div>
        </div>
        <div class="stat-item">
          <div class="stat-item-label">Total Score</div>
          <div class="stat-item-val gold">+${gameState.xp} XP</div>
        </div>
        <div class="stat-item">
          <div class="stat-item-label">Scenes Discovered</div>
          <div class="stat-item-val">${gameState.visitedScenes.size}</div>
        </div>
        <div class="stat-item">
          <div class="stat-item-label">Words Learned</div>
          <div class="stat-item-val">${gameState.learnedWords.size} / 14</div>
        </div>
      `;
      card.appendChild(statsGrid);

      // FINAL BUTTONS (Section 14: ONLY PLAY AGAIN and QUIT)
      const actions = document.createElement('div');
      actions.className = 'ending-actions';

      const playAgainBtn = document.createElement('button');
      playAgainBtn.className = 'btn-ending-play-again';
      playAgainBtn.textContent = 'PLAY AGAIN';
      playAgainBtn.addEventListener('click', resetAndRestartGame);

      const quitBtn = document.createElement('button');
      quitBtn.className = 'btn-ending-quit';
      quitBtn.textContent = 'QUIT';
      quitBtn.addEventListener('click', handleQuitGame);

      actions.appendChild(playAgainBtn);
      actions.appendChild(quitBtn);
      card.appendChild(actions);

    } else {
      // FAILED / INCOMPLETE MISSION BUTTON (Section 9 & 11: TRY AGAIN)
      const actions = document.createElement('div');
      actions.className = 'ending-actions';

      const tryAgainBtn = document.createElement('button');
      tryAgainBtn.className = 'btn-ending-try-again';
      tryAgainBtn.textContent = 'TRY AGAIN';
      tryAgainBtn.addEventListener('click', resetAndRestartGame);

      actions.appendChild(tryAgainBtn);
      card.appendChild(actions);
    }

    endingSection.appendChild(card);
    return { element: endingSection, imgElement: img };
  }

  // ==========================================================================
  // CHOICE CLICK HANDLER (Section 19 & 20: Lock transition, append below)
  // ==========================================================================
  function handleChoiceClick(choice, clickedBtn, choicesContainer) {
    if (isTransitioning) return;
    isTransitioning = true;

    // Immediately disable all choices in current scene to prevent double-clicking
    const allButtons = choicesContainer.querySelectorAll('.choice-btn');
    allButtons.forEach(btn => {
      btn.disabled = true;
    });

    // Mark clicked button as chosen
    clickedBtn.classList.add('chosen');

    audio.playBubbleSound();
    if (choice.badge) {
      unlockBadge(choice.badge);
    }

    // Append next scene BELOW
    appendNextScene(choice.next);
  }

  function appendNextScene(targetId) {
    const storyContainer = document.getElementById('story-container');
    const node = STORY_NODES[targetId];

    if (!node) {
      console.error("Critical: Target scene ID not found:", targetId);
      isTransitioning = false;
      return;
    }

    gameState.currentScene = targetId;
    gameState.visitedScenes.add(targetId);

    // Cancel any previous speech
    if (window.speechSynthesis) window.speechSynthesis.cancel();
    if (gameState.activeSpeakingBtn) {
      resetSpeakingButton(gameState.activeSpeakingBtn);
    }

    let created;
    if (node.type === "ending") {
      gameState.ending = targetId;

      // CRITICAL (Section 17): Stop background music completely!
      audio.stopBGM();

      if (node.isSuccess) {
        audio.playChimeSound();
        addXP(node.xpReward, "Mission Completed!");
      } else {
        audio.playTensionSound();
      }

      created = createEndingElement(node);
    } else {
      // Set audio mood for story scenes
      audio.setMood(node.musicMood || 'calm');
      if (node.musicMood === 'dramatic') {
        audio.playTensionSound();
      }

      if (node.xpReward) {
        addXP(node.xpReward, `Discovered Scene 0${node.chapter}`);
      }

      created = createSceneElement(node);
    }

    const nextSceneEl = created.element;
    const imgEl = created.imgElement;

    // Append to container (Section 1 & 2: Appended BELOW current reading position)
    storyContainer.appendChild(nextSceneEl);

    // Bind vocabulary clicks on newly created scene
    bindVocabListeners(nextSceneEl);

    // Automatic smooth scroll to the newly appended scene (Section 3 & 4)
    const triggerScroll = () => {
      requestAnimationFrame(() => {
        nextSceneEl.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
        isTransitioning = false;
      });
    };

    if (imgEl && !imgEl.complete) {
      imgEl.onload = triggerScroll;
      imgEl.onerror = () => {
        handleImageError(imgEl);
        triggerScroll();
      };
      // Fallback timeout in case image loading stalls
      setTimeout(triggerScroll, 250);
    } else {
      triggerScroll();
    }
  }

  // ==========================================================================
  // NARRATION SPEECH TOGGLE (Per Scene)
  // ==========================================================================
  function toggleSceneNarration(text, btn) {
    if (!('speechSynthesis' in window)) return;

    if (btn.classList.contains('speaking')) {
      window.speechSynthesis.cancel();
      resetSpeakingButton(btn);
    } else {
      window.speechSynthesis.cancel();
      if (gameState.activeSpeakingBtn) {
        resetSpeakingButton(gameState.activeSpeakingBtn);
      }

      gameState.activeSpeakingBtn = btn;
      btn.classList.add('speaking');
      btn.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect></svg> <span>Pause</span>`;

      speakBritishText(text, () => {
        resetSpeakingButton(btn);
      });
    }
  }

  function resetSpeakingButton(btn) {
    if (!btn) return;
    btn.classList.remove('speaking');
    btn.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg> <span>Listen</span>`;
    if (gameState.activeSpeakingBtn === btn) {
      gameState.activeSpeakingBtn = null;
    }
  }

  // ==========================================================================
  // XP & ACHIEVEMENTS SYSTEM
  // ==========================================================================
  function addXP(amount, reason) {
    gameState.xp += amount;
    updateStatsPills();
    showToast(`+${amount} XP`, reason || "Progress Made!");
  }

  function unlockBadge(badgeName) {
    if (gameState.unlockedBadges.has(badgeName)) return;
    gameState.unlockedBadges.add(badgeName);
    showToast("Badge Unlocked!", badgeName, "🏅");
  }

  function updateStatsPills() {
    const xpLabel = document.getElementById('header-xp-val');
    if (xpLabel) xpLabel.textContent = gameState.xp;
  }

  function showToast(title, desc, icon = "✨") {
    const toast = document.getElementById('toast-notification');
    if (!toast) return;

    document.getElementById('toast-icon-text').textContent = icon;
    document.getElementById('toast-title-text').textContent = title;
    document.getElementById('toast-desc-text').textContent = desc;

    toast.classList.add('show');
    clearTimeout(toast._timeout);
    toast._timeout = setTimeout(() => {
      toast.classList.remove('show');
    }, 2800);
  }

  // ==========================================================================
  // VOCABULARY LISTENER BINDING
  // ==========================================================================
  function bindVocabListeners(parentElement = document) {
    parentElement.querySelectorAll('.vocab-word').forEach(span => {
      span.addEventListener('click', (e) => {
        e.stopPropagation();
        const wordKey = span.getAttribute('data-word');
        showVocabModal(wordKey);
      });
    });
  }

  // ==========================================================================
  // IMAGE ERROR FALLBACK (Section 21)
  // ==========================================================================
  window.handleImageError = function (imgElement) {
    console.warn("Failed to load scene image:", imgElement.src);
    if (!imgElement.src.includes('fallback.jpg')) {
      imgElement.src = 'images/fallback.jpg';
    }
  };

  // ==========================================================================
  // RESET / REPLAY / QUIT ENGINE (Section 14, 15, 16)
  // ==========================================================================
  function resetAndRestartGame() {
    audio.playBubbleSound();
    isTransitioning = false;

    // Completely reset game state (Section 15)
    gameState.currentScene = "scene-01";
    gameState.ending = null;
    gameState.xp = 0;
    gameState.visitedScenes.clear();
    gameState.learnedWords.clear();
    gameState.unlockedBadges.clear();
    updateStatsPills();

    // Clear story container
    const storyContainer = document.getElementById('story-container');
    storyContainer.innerHTML = '';
    storyContainer.style.display = 'flex';

    // Hide start screen & quit overlay
    document.getElementById('start-screen-view').style.display = 'none';
    document.getElementById('quit-overlay').style.display = 'none';

    // Restart background music (Section 17)
    audio.startBGM();

    // Append Scene 1
    appendNextScene("scene-01");
  }

  function handleQuitGame() {
    // End game experience (Section 16)
    audio.stopBGM();
    if (window.speechSynthesis) window.speechSynthesis.cancel();

    const quitOverlay = document.getElementById('quit-overlay');
    if (quitOverlay) {
      quitOverlay.style.display = 'flex';
    }

    try {
      window.close();
    } catch (e) { }
  }

  // ==========================================================================
  // BUBBLE & PARTICLE CANVAS BACKGROUND
  // ==========================================================================
  function initParticleCanvas() {
    const canvas = document.getElementById('bubble-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    });

    const particles = [];
    const count = Math.min(50, Math.floor(width / 30));

    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        r: Math.random() * 3 + 1,
        speed: Math.random() * 0.8 + 0.3,
        alpha: Math.random() * 0.4 + 0.1,
        osc: Math.random() * 6.28,
        oscSpeed: Math.random() * 0.02 + 0.01
      });
    }

    function renderParticles() {
      ctx.clearRect(0, 0, width, height);
      particles.forEach(p => {
        p.y -= p.speed;
        p.osc += p.oscSpeed;
        const currentX = p.x + Math.sin(p.osc) * 1.5;

        if (p.y < -10) {
          p.y = height + 10;
          p.x = Math.random() * width;
        }

        ctx.beginPath();
        ctx.arc(currentX, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(56, 189, 248, ${p.alpha})`;
        ctx.fill();
      });
      requestAnimationFrame(renderParticles);
    }

    renderParticles();
  }

  // ==========================================================================
  // INITIALIZATION
  // ==========================================================================
  document.addEventListener('DOMContentLoaded', () => {
    initParticleCanvas();

    // BEGIN THE STORY BUTTON (Section 18)
    const beginBtn = document.getElementById('begin-story-btn');
    if (beginBtn) {
      beginBtn.addEventListener('click', () => {
        audio.initContext();
        audio.playBubbleSound();

        // Hide start screen, reveal story container
        document.getElementById('start-screen-view').style.display = 'none';
        const storyContainer = document.getElementById('story-container');
        storyContainer.style.display = 'flex';
        storyContainer.innerHTML = '';

        audio.startBGM();
        appendNextScene('scene-01');
      });
    }

    // Audio Mute Toggle
    const audioToggleBtn = document.getElementById('audio-toggle-btn');
    if (audioToggleBtn) {
      audioToggleBtn.addEventListener('click', () => {
        audio.toggleMute();
      });
    }

    // Brand Header Click
    const brandLink = document.getElementById('brand-home-link');
    if (brandLink) {
      brandLink.addEventListener('click', () => {
        const firstScene = document.getElementById('scene-scene-01');
        if (firstScene) {
          firstScene.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    }

    // Quit Overlay Restart Button
    const quitRestartBtn = document.getElementById('quit-restart-btn');
    if (quitRestartBtn) {
      quitRestartBtn.addEventListener('click', () => {
        document.getElementById('quit-overlay').style.display = 'none';
        resetAndRestartGame();
      });
    }

    // Vocab Modal Pronunciation Button
    const modalSpeakBtn = document.getElementById('modal-speak-btn');
    if (modalSpeakBtn) {
      modalSpeakBtn.addEventListener('click', () => {
        const word = document.getElementById('modal-word').textContent;
        speakBritishText(word);
      });
    }

    // Vocab Modal Close Button & Backdrop
    const modalCloseBtn = document.getElementById('modal-close-btn');
    if (modalCloseBtn) {
      modalCloseBtn.addEventListener('click', hideVocabModal);
    }
    const vocabBackdrop = document.getElementById('vocab-modal');
    if (vocabBackdrop) {
      vocabBackdrop.addEventListener('click', (e) => {
        if (e.target === vocabBackdrop) hideVocabModal();
      });
    }

    // Keyboard Shortcuts
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        hideVocabModal();
      }
    });
  });

})();
