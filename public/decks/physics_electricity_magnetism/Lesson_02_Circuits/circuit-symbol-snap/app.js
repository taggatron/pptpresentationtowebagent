/**
 * 60-SECOND CHALLENGE: SYMBOL SNAP
 * Full Interactive Drag & Drop Matching Engine, Web Audio Synthesizer,
 * 60s Countdown Timer, and Electrical Engineering Component Sandbox.
 */

// =============================================================================
// COMPONENT DATABASE (Standardized IEC / BS Symbols & Educational Data)
// =============================================================================
const COMPONENTS_DB = {
  'cell': {
    name: 'Cell',
    category: 'DC Power Source',
    description: 'Provides electrical potential difference (voltage) via an internal electrochemical reaction. The long, thin line represents the positive terminal (+) and the shorter, thicker line represents the negative terminal (-).',
    circuitFunction: 'Supplies electromotive force (EMF) to drive electric current through a closed circuit.',
    connection: 'Series or parallel (joining multiple cells creates a Battery).',
    formula: 'V = W / Q (1 Volt = 1 Joule per Coulomb)',
    example: '1.5V AA alkaline battery cell or single 3.7V Lithium-ion cell.',
    svg: `<svg viewBox="0 0 180 80" class="symbol-svg"><line x1="20" y1="40" x2="72" y2="40" stroke="currentColor" stroke-width="3.5" stroke-linecap="round"/><line x1="72" y1="18" x2="72" y2="62" stroke="currentColor" stroke-width="3.5" stroke-linecap="round"/><line x1="90" y1="28" x2="90" y2="52" stroke="currentColor" stroke-width="8" stroke-linecap="square"/><line x1="90" y1="40" x2="140" y2="40" stroke="currentColor" stroke-width="3.5" stroke-linecap="round"/><text x="72" y="13" font-family="'Plus Jakarta Sans', sans-serif" font-weight="800" font-size="20" text-anchor="middle" fill="currentColor">+</text><text x="91" y="14" font-family="'Plus Jakarta Sans', sans-serif" font-weight="800" font-size="24" text-anchor="middle" fill="currentColor">−</text></svg>`,
    sandbox: {
      type: 'cell-slider',
      min: 1.5, max: 9, step: 1.5, default: 1.5, unit: 'V'
    }
  },
  'open-switch': {
    name: 'Open Switch',
    category: 'Control & Safety Mechanism',
    description: 'A mechanical control device shown in the "open" (disengaged) state. The angled contact creates an air gap with infinite resistance, preventing current from completing the loop.',
    circuitFunction: 'Safely interrupts or restores current flow to connected loads.',
    connection: 'Always wired in series with the load.',
    formula: 'Open: R = ∞, I = 0 A | Closed: R ≈ 0 Ω, I = V / R_load',
    example: 'Wall light switch, emergency isolator switch, relay contact.',
    svg: `<svg viewBox="0 0 180 80" class="symbol-svg"><line x1="20" y1="44" x2="62" y2="44" stroke="currentColor" stroke-width="3.5" stroke-linecap="round"/><line x1="62" y1="44" x2="116" y2="24" stroke="currentColor" stroke-width="3.5" stroke-linecap="round"/><line x1="120" y1="44" x2="160" y2="44" stroke="currentColor" stroke-width="3.5" stroke-linecap="round"/></svg>`,
    sandbox: {
      type: 'switch-toggle'
    }
  },
  'lamp-bulb': {
    name: 'Lamp / Bulb',
    category: 'Output Transducer (Load)',
    description: 'An output transducer represented by a circle with a cross (X). Converts electrical energy into thermal energy and visible light.',
    circuitFunction: 'Provides illumination and visual indication of current flow.',
    connection: 'Connected across potential difference (series or parallel branches).',
    formula: 'P = I × V = I²R = V² / R (Power in Watts)',
    example: 'Tungsten filament bulb, halogen lamp, automotive indicator.',
    svg: `<svg viewBox="0 0 180 80" class="symbol-svg"><line x1="20" y1="40" x2="65" y2="40" stroke="currentColor" stroke-width="3.5" stroke-linecap="round"/><line x1="115" y1="40" x2="160" y2="40" stroke="currentColor" stroke-width="3.5" stroke-linecap="round"/><circle cx="90" cy="40" r="25" fill="none" stroke="currentColor" stroke-width="3.5"/><line x1="72.3" y1="22.3" x2="107.7" y2="57.7" stroke="currentColor" stroke-width="3.5" stroke-linecap="round"/><line x1="72.3" y1="57.7" x2="107.7" y2="22.3" stroke="currentColor" stroke-width="3.5" stroke-linecap="round"/></svg>`,
    sandbox: {
      type: 'lamp-dimmer'
    }
  },
  'ammeter': {
    name: 'Ammeter',
    category: 'Measurement Instrument',
    description: 'Measures the rate of flow of electrical charge (current) in Amperes (A). Has near-zero internal resistance so it does not restrict the current it measures.',
    circuitFunction: 'Measures current flowing through a circuit branch.',
    connection: 'Must ALWAYS be connected in SERIES with the component being tested.',
    formula: 'I = Q / t (1 Ampere = 1 Coulomb per second)',
    example: 'Digital benchtop multimeter, automotive clamp meter, analog galvanometer.',
    svg: `<svg viewBox="0 0 180 80" class="symbol-svg"><line x1="20" y1="40" x2="65" y2="40" stroke="currentColor" stroke-width="3.5" stroke-linecap="round"/><line x1="115" y1="40" x2="160" y2="40" stroke="currentColor" stroke-width="3.5" stroke-linecap="round"/><circle cx="90" cy="40" r="25" fill="none" stroke="currentColor" stroke-width="3.5"/><text x="90" y="49" font-family="'Plus Jakarta Sans', sans-serif" font-weight="700" font-size="28" text-anchor="middle" fill="currentColor">A</text></svg>`,
    sandbox: {
      type: 'ammeter-demo'
    }
  },
  'voltmeter': {
    name: 'Voltmeter',
    category: 'Measurement Instrument',
    description: 'Measures the electrical potential difference between two points in Volts (V). Has extremely high internal resistance (ideal: infinite) to prevent drawing current from the circuit.',
    circuitFunction: 'Measures energy transferred per unit charge across a component.',
    connection: 'Must ALWAYS be connected in PARALLEL across the component being measured.',
    formula: 'V = I × R = W / Q',
    example: 'Battery state-of-charge tester, oscilloscope voltage probe.',
    svg: `<svg viewBox="0 0 180 80" class="symbol-svg"><line x1="20" y1="40" x2="65" y2="40" stroke="currentColor" stroke-width="3.5" stroke-linecap="round"/><line x1="115" y1="40" x2="160" y2="40" stroke="currentColor" stroke-width="3.5" stroke-linecap="round"/><circle cx="90" cy="40" r="25" fill="none" stroke="currentColor" stroke-width="3.5"/><text x="90" y="49" font-family="'Plus Jakarta Sans', sans-serif" font-weight="700" font-size="28" text-anchor="middle" fill="currentColor">V</text></svg>`,
    sandbox: {
      type: 'voltmeter-demo'
    }
  },
  'fixed-resistor': {
    name: 'Fixed Resistor',
    category: 'Passive Linear Impedance',
    description: 'Standard rectangular IEC symbol. Opposes the flow of electric current by a constant, predetermined resistance value measured in Ohms (Ω).',
    circuitFunction: 'Limits circuit current, divides voltage, and protects sensitive components.',
    connection: 'Series or parallel branches.',
    formula: 'V = I × R (Ohm’s Law) | R_series = R1 + R2',
    example: '220Ω resistor protecting an LED, pull-up resistor on microcontrollers.',
    svg: `<svg viewBox="0 0 180 80" class="symbol-svg"><line x1="20" y1="40" x2="60" y2="40" stroke="currentColor" stroke-width="3.5" stroke-linecap="round"/><rect x="60" y="27" width="60" height="26" fill="none" stroke="currentColor" stroke-width="3.5" rx="1"/><line x1="120" y1="40" x2="160" y2="40" stroke="currentColor" stroke-width="3.5" stroke-linecap="round"/></svg>`,
    sandbox: {
      type: 'resistor-demo'
    }
  },
  'variable-resistor': {
    name: 'Variable Resistor',
    category: 'Adjustable Resistance (Rheostat)',
    description: 'Standard rectangular resistor symbol with a diagonal arrow pointing through it. Allows manual adjustment of electrical resistance.',
    circuitFunction: 'Modulates current flow or potential division dynamically.',
    connection: 'Two-terminal rheostat mode (series) or three-terminal potentiometer mode.',
    formula: 'R = ρ × (L / A) (adjusting conductive path length L)',
    example: 'Audio volume dial, lighting dimmer control, motor speed regulator.',
    svg: `<svg viewBox="0 0 180 80" class="symbol-svg"><line x1="20" y1="40" x2="60" y2="40" stroke="currentColor" stroke-width="3.5" stroke-linecap="round"/><line x1="120" y1="40" x2="160" y2="40" stroke="currentColor" stroke-width="3.5" stroke-linecap="round"/><rect x="60" y="27" width="60" height="26" fill="none" stroke="currentColor" stroke-width="3.5" rx="1"/><line x1="66" y1="64" x2="114" y2="16" stroke="currentColor" stroke-width="3.5" stroke-linecap="round"/><polygon points="114,16 103,18 112,27" fill="currentColor"/></svg>`,
    sandbox: {
      type: 'variable-resistor-demo'
    }
  },
  'ldr': {
    name: 'LDR',
    category: 'Optoelectronic Sensor',
    description: 'Light Dependent Resistor. Enclosed in a circle with incoming parallel light arrows. Its resistance decreases sharply as ambient light intensity increases (mnemonic: LURD — Light Up, Resistance Down).',
    circuitFunction: 'Detects light levels to trigger automatic electronic switches.',
    connection: 'Connected in a potential divider circuit with a fixed resistor.',
    formula: 'Dark: R ≈ 1,000,000 Ω (1 MΩ) | Bright Daylight: R ≈ 400 Ω',
    example: 'Automatic dusk-to-dawn street lighting, smartphone screen brightness sensor.',
    svg: `<svg viewBox="0 0 180 80" class="symbol-svg"><circle cx="90" cy="40" r="28" fill="none" stroke="currentColor" stroke-width="3.5"/><rect x="80" y="25" width="20" height="30" fill="none" stroke="currentColor" stroke-width="3" rx="1"/><line x1="20" y1="40" x2="62" y2="40" stroke="currentColor" stroke-width="3.5" stroke-linecap="round"/><line x1="118" y1="40" x2="160" y2="40" stroke="currentColor" stroke-width="3.5" stroke-linecap="round"/><line x1="50" y1="12" x2="67" y2="29" stroke="currentColor" stroke-width="3.2" stroke-linecap="round"/><polygon points="67,29 57,27 65,19" fill="currentColor"/><line x1="60" y1="5" x2="77" y2="22" stroke="currentColor" stroke-width="3.2" stroke-linecap="round"/><polygon points="77,22 67,20 75,12" fill="currentColor"/></svg>`,
    sandbox: {
      type: 'ldr-demo'
    }
  },
  'led': {
    name: 'LED',
    category: 'Semiconductor Light Emitter',
    description: 'Light Emitting Diode. Diode symbol inside a circle with outgoing light arrows. Only allows current to flow in forward bias (triangle direction) and emits light photons.',
    circuitFunction: 'Converts electrical energy directly into visible monochromatic photons with high efficiency.',
    connection: 'Forward-biased with an essential series current-limiting resistor.',
    formula: 'Threshold Voltage V_f ≈ 1.8V to 3.2V | E_photon = h × f',
    example: 'Power indicator lights, TV remote infrared emitters, LED bulb fixtures.',
    svg: `<svg viewBox="0 0 180 80" class="symbol-svg"><circle cx="90" cy="40" r="28" fill="none" stroke="currentColor" stroke-width="3.5"/><polygon points="77,27 100,40 77,53" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linejoin="miter"/><line x1="100" y1="26" x2="100" y2="54" stroke="currentColor" stroke-width="3.5" stroke-linecap="round"/><line x1="20" y1="40" x2="77" y2="40" stroke="currentColor" stroke-width="3.5" stroke-linecap="round"/><line x1="100" y1="40" x2="160" y2="40" stroke="currentColor" stroke-width="3.5" stroke-linecap="round"/><line x1="104" y1="24" x2="120" y2="8" stroke="currentColor" stroke-width="3.2" stroke-linecap="round"/><polygon points="120,8 111,16 119,17" fill="currentColor"/><line x1="113" y1="33" x2="129" y2="17" stroke="currentColor" stroke-width="3.2" stroke-linecap="round"/><polygon points="129,17 120,25 128,26" fill="currentColor"/></svg>`,
    sandbox: {
      type: 'led-demo'
    }
  }
};

// =============================================================================
// SYNTHETIC SOUND ENGINE (Web Audio API - No External Assets Needed)
// =============================================================================
class SoundEngine {
  constructor() {
    this.ctx = null;
    this.enabled = localStorage.getItem('symbol_snap_sound') !== 'false';
  }

  init() {
    if (!this.ctx && typeof AudioContext !== 'undefined') {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  toggle() {
    this.enabled = !this.enabled;
    localStorage.setItem('symbol_snap_sound', this.enabled);
    return this.enabled;
  }

  playSnap() {
    if (!this.enabled) return;
    this.init();
    try {
      const t = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(620, t);
      osc.frequency.exponentialRampToValueAtTime(180, t + 0.08);

      gain.gain.setValueAtTime(0.2, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.08);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(t);
      osc.stop(t + 0.08);
    } catch (e) { /* ignore audio errors */ }
  }

  playCorrect() {
    if (!this.enabled) return;
    this.init();
    try {
      const notes = [523.25, 659.25, 783.99]; // C5, E5, G5 major triad
      notes.forEach((freq, idx) => {
        const t = this.ctx.currentTime + idx * 0.07;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, t);

        gain.gain.setValueAtTime(0.18, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.22);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(t);
        osc.stop(t + 0.22);
      });
    } catch (e) { /* ignore audio errors */ }
  }

  playWrong() {
    if (!this.enabled) return;
    this.init();
    try {
      const t = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(160, t);
      osc.frequency.setValueAtTime(130, t + 0.1);

      gain.gain.setValueAtTime(0.18, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.25);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(t);
      osc.stop(t + 0.25);
    } catch (e) { /* ignore audio errors */ }
  }

  playTick() {
    if (!this.enabled) return;
    this.init();
    try {
      const t = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(880, t);

      gain.gain.setValueAtTime(0.08, t);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.03);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(t);
      osc.stop(t + 0.03);
    } catch (e) { /* ignore audio errors */ }
  }

  playVictory() {
    if (!this.enabled) return;
    this.init();
    try {
      const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
      notes.forEach((freq, idx) => {
        const t = this.ctx.currentTime + idx * 0.12;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, t);

        gain.gain.setValueAtTime(0.24, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.45);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(t);
        osc.stop(t + 0.45);
      });
    } catch (e) { /* ignore audio errors */ }
  }
}

// =============================================================================
// CONFETTI BURST SYSTEM
// =============================================================================
class ConfettiCannon {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.particles = [];
    this.animating = false;
    this.resize();
    window.addEventListener('resize', () => this.resize());
  }

  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  fire(durationMs = 3000) {
    this.resize();
    const colors = ['#2563eb', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];
    const count = 120;

    for (let i = 0; i < count; i++) {
      this.particles.push({
        x: this.canvas.width * 0.5 + (Math.random() - 0.5) * 200,
        y: this.canvas.height * 0.4,
        vx: (Math.random() - 0.5) * 16,
        vy: -Math.random() * 14 - 4,
        size: Math.random() * 8 + 5,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        vr: (Math.random() - 0.5) * 12,
        gravity: 0.38,
        drag: 0.98,
        opacity: 1
      });
    }

    if (!this.animating) {
      this.animating = true;
      this.loop();
    }

    setTimeout(() => {
      // naturally fades out
    }, durationMs);
  }

  loop() {
    if (!this.particles.length) {
      this.animating = false;
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      return;
    }

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.vx *= p.drag;
      p.vy += p.gravity;
      p.x += p.vx;
      p.y += p.vy;
      p.rotation += p.vr;
      p.opacity -= 0.007;

      if (p.opacity <= 0 || p.y > this.canvas.height + 50) {
        this.particles.splice(i, 1);
        continue;
      }

      this.ctx.save();
      this.ctx.translate(p.x, p.y);
      this.ctx.rotate((p.rotation * Math.PI) / 180);
      this.ctx.globalAlpha = Math.max(0, p.opacity);
      this.ctx.fillStyle = p.color;
      this.ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
      this.ctx.restore();
    }

    requestAnimationFrame(() => this.loop());
  }
}

// =============================================================================
// MAIN APPLICATION CONTROLLER
// =============================================================================
class SymbolSnapApp {
  constructor() {
    // Sound & Confetti
    this.sound = new SoundEngine();
    this.confetti = new ConfettiCannon(document.getElementById('confetti-canvas'));

    // State Variables
    this.totalSeconds = 60;
    this.secondsRemaining = 60;
    this.timerInterval = null;
    this.timerRunning = false;
    this.mode = 'challenge'; // 'challenge' or 'practice'
    
    // Placements Map: { [targetId]: labelId }
    this.placements = {};
    
    // Selection state for Tap-to-Place
    this.selectedCard = null;

    // Pointer-events dragging tracking
    this.activePointerDrag = null;

    // DOM Elements
    this.dom = {
      timerWidget: document.getElementById('timer-widget'),
      timerDigits: document.getElementById('timer-text'),
      timerRingProgress: document.getElementById('timer-ring-progress'),
      btnTimerToggle: document.getElementById('btn-timer-toggle'),
      btnTimerLabel: document.getElementById('btn-timer-label'),
      iconPlay: document.querySelector('.icon-play'),
      iconPause: document.querySelector('.icon-pause'),
      btnReset: document.getElementById('btn-reset'),
      btnCheck: document.getElementById('btn-check'),
      btnShuffle: document.getElementById('btn-shuffle'),
      btnSoundToggle: document.getElementById('btn-sound-toggle'),
      iconSoundOn: document.querySelector('.icon-sound-on'),
      iconSoundOff: document.querySelector('.icon-sound-off'),
      btnThemeToggle: document.getElementById('btn-theme-toggle'),
      btnPrint: document.getElementById('btn-print'),
      btnPairShare: document.getElementById('btn-pair-share'),
      modeChallenge: document.getElementById('mode-challenge'),
      modePractice: document.getElementById('mode-practice'),
      matchCount: document.getElementById('match-count'),
      progressFill: document.getElementById('progress-fill'),
      bestTimeVal: document.getElementById('best-time-val'),
      labelsBank: document.getElementById('labels-bank'),
      dropZones: document.querySelectorAll('.drop-zone'),
      nameCards: document.querySelectorAll('.name-card'),
      infoBtns: document.querySelectorAll('.info-bubble-btn'),
      
      // Modals
      modalResult: document.getElementById('modal-result'),
      btnCloseResult: document.getElementById('btn-close-result'),
      btnPlayAgain: document.getElementById('btn-play-again'),
      btnReviewAnswers: document.getElementById('btn-review-answers'),
      resScore: document.getElementById('res-score'),
      resTime: document.getElementById('res-time'),
      resRank: document.getElementById('res-rank'),
      resultIconWrap: document.getElementById('result-icon-wrap'),
      resultTitle: document.getElementById('result-title'),
      resultMessage: document.getElementById('result-message'),
      
      modalPairShare: document.getElementById('modal-pair-share'),
      btnClosePair: document.getElementById('btn-close-pair'),
      btnDonePair: document.getElementById('btn-done-pair'),
      
      modalInfo: document.getElementById('modal-info'),
      btnCloseInfo: document.getElementById('btn-close-info'),
      infoCompTitle: document.getElementById('info-comp-title'),
      infoCategory: document.getElementById('info-category'),
      infoDescription: document.getElementById('info-description'),
      infoFunction: document.getElementById('info-function'),
      infoConnection: document.getElementById('info-connection'),
      infoFormula: document.getElementById('info-formula'),
      infoExample: document.getElementById('info-example'),
      infoPreviewSlot: document.getElementById('info-preview-slot'),
      sandboxStage: document.getElementById('sandbox-stage'),
      sandboxControls: document.getElementById('sandbox-controls'),
      sandboxReadout: document.getElementById('sandbox-readout')
    };

    this.init();
  }

  init() {
    this.loadBestTime();
    this.initTheme();
    this.updateSoundIcons();
    this.setupEventListeners();
    this.setupDragAndDrop();
    this.setupPointerDrag();
    this.shuffleCards();
    this.updateTimerDisplay();
  }

  // ---------------------------------------------------------------------------
  // THEME & SOUND CONTROLS
  // ---------------------------------------------------------------------------
  initTheme() {
    const savedTheme = localStorage.getItem('symbol_snap_theme') || 'notebook';
    document.body.setAttribute('data-theme', savedTheme);
  }

  cycleTheme() {
    const currentTheme = document.body.getAttribute('data-theme') || 'notebook';
    const themes = ['notebook', 'blueprint', 'studio'];
    const nextIndex = (themes.indexOf(currentTheme) + 1) % themes.length;
    const nextTheme = themes[nextIndex];
    document.body.setAttribute('data-theme', nextTheme);
    localStorage.setItem('symbol_snap_theme', nextTheme);
  }

  updateSoundIcons() {
    if (this.sound.enabled) {
      this.dom.iconSoundOn.style.display = 'block';
      this.dom.iconSoundOff.style.display = 'none';
    } else {
      this.dom.iconSoundOn.style.display = 'none';
      this.dom.iconSoundOff.style.display = 'block';
    }
  }

  // ---------------------------------------------------------------------------
  // TIMER & GAME MODES
  // ---------------------------------------------------------------------------
  startTimer() {
    if (this.timerRunning) return;
    this.sound.init();
    this.timerRunning = true;
    this.dom.iconPlay.style.display = 'none';
    this.dom.iconPause.style.display = 'block';
    this.dom.btnTimerLabel.textContent = 'Pause';
    this.dom.btnTimerToggle.classList.add('active');

    this.timerInterval = setInterval(() => {
      this.secondsRemaining--;
      this.updateTimerDisplay();

      if (this.secondsRemaining <= 10 && this.secondsRemaining > 0) {
        this.sound.playTick();
      }

      if (this.secondsRemaining <= 0) {
        this.pauseTimer();
        this.handleTimeUp();
      }
    }, 1000);
  }

  pauseTimer() {
    this.timerRunning = false;
    clearInterval(this.timerInterval);
    this.timerInterval = null;
    this.dom.iconPlay.style.display = 'block';
    this.dom.iconPause.style.display = 'none';
    this.dom.btnTimerLabel.textContent = 'Resume';
    this.dom.btnTimerToggle.classList.remove('active');
  }

  resetTimer() {
    this.pauseTimer();
    this.secondsRemaining = this.totalSeconds;
    this.dom.btnTimerLabel.textContent = 'Start Challenge';
    this.updateTimerDisplay();
  }

  updateTimerDisplay() {
    const mins = Math.floor(this.secondsRemaining / 60);
    const secs = this.secondsRemaining % 60;
    this.dom.timerDigits.textContent = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;

    // SVG Circular Ring Progress: Perimeter = 2 * PI * 19 = 119.38
    const circumference = 119.38;
    const progress = this.secondsRemaining / this.totalSeconds;
    const offset = circumference * (1 - progress);
    this.dom.timerRingProgress.style.strokeDashoffset = offset;

    // Visual Alert States
    if (this.secondsRemaining <= 10) {
      this.dom.timerWidget.className = 'timer-widget danger';
    } else if (this.secondsRemaining <= 20) {
      this.dom.timerWidget.className = 'timer-widget warning';
    } else {
      this.dom.timerWidget.className = 'timer-widget';
    }
  }

  setMode(newMode) {
    this.mode = newMode;
    if (newMode === 'challenge') {
      this.dom.modeChallenge.classList.add('active');
      this.dom.modeChallenge.setAttribute('aria-checked', 'true');
      this.dom.modePractice.classList.remove('active');
      this.dom.modePractice.setAttribute('aria-checked', 'false');
      this.dom.btnCheck.style.display = 'inline-flex';
      this.dom.timerWidget.style.display = 'flex';
      this.dom.btnTimerToggle.style.display = 'inline-flex';
    } else {
      this.dom.modePractice.classList.add('active');
      this.dom.modePractice.setAttribute('aria-checked', 'true');
      this.dom.modeChallenge.classList.remove('active');
      this.dom.modeChallenge.setAttribute('aria-checked', 'false');
      this.pauseTimer();
      // Instantly evaluate existing placements
      this.evaluateAllPlacements(false);
    }
  }

  // ---------------------------------------------------------------------------
  // MATCHING & VALIDATION
  // ---------------------------------------------------------------------------
  placeCardInSlot(labelId, targetId) {
    // If timer not started and in challenge mode, start now automatically!
    if (this.mode === 'challenge' && !this.timerRunning && this.secondsRemaining > 0) {
      this.startTimer();
    }

    // Check if target slot already contains another card -> swap or return old card
    if (this.placements[targetId] && this.placements[targetId] !== labelId) {
      const oldLabelId = this.placements[targetId];
      this.returnCardToBank(oldLabelId);
    }

    // Check if this card was previously in another slot -> clear that old slot
    for (const [slotId, placedId] of Object.entries(this.placements)) {
      if (placedId === labelId && slotId !== targetId) {
        delete this.placements[slotId];
        const oldZone = document.querySelector(`.drop-zone[data-target-id="${slotId}"]`);
        if (oldZone) {
          oldZone.innerHTML = '<span class="drop-zone-placeholder">Drop Name Here</span>';
          oldZone.classList.remove('has-card');
          const oldCardParent = oldZone.closest('.symbol-card');
          if (oldCardParent) oldCardParent.className = 'symbol-card';
        }
      }
    }

    // Assign placement
    this.placements[targetId] = labelId;
    this.sound.playSnap();

    // Render placed card in the target drop-zone
    const dropZone = document.querySelector(`.drop-zone[data-target-id="${targetId}"]`);
    const cardData = COMPONENTS_DB[labelId];
    if (dropZone && cardData) {
      dropZone.innerHTML = `
        <div class="name-card slotted" data-label-id="${labelId}" title="Click to remove">
          <span class="card-text">${cardData.name}</span>
        </div>
      `;
      dropZone.classList.add('has-card');
    }

    // Dim/Mark card in bank
    const bankCard = document.querySelector(`#labels-bank .name-card[data-label-id="${labelId}"]`);
    if (bankCard) {
      bankCard.classList.add('is-placed');
      bankCard.setAttribute('aria-disabled', 'true');
    }

    // Clear selection
    this.clearSelection();

    // In practice mode: Give instant feedback
    if (this.mode === 'practice') {
      const isCorrect = (labelId === targetId);
      const parentCard = dropZone.closest('.symbol-card');
      if (isCorrect) {
        parentCard.className = 'symbol-card matched-correct';
        this.sound.playCorrect();
      } else {
        parentCard.className = 'symbol-card matched-incorrect';
        this.sound.playWrong();
      }
    }

    this.updateProgress();

    // If all 9 slots filled in challenge mode, automatically check!
    if (Object.keys(this.placements).length === 9) {
      setTimeout(() => {
        this.checkAnswers();
      }, 350);
    }
  }

  returnCardToBank(labelId) {
    // Find slot holding it
    for (const [slotId, placedId] of Object.entries(this.placements)) {
      if (placedId === labelId) {
        delete this.placements[slotId];
        const dropZone = document.querySelector(`.drop-zone[data-target-id="${slotId}"]`);
        if (dropZone) {
          dropZone.innerHTML = '<span class="drop-zone-placeholder">Drop Name Here</span>';
          dropZone.classList.remove('has-card');
          const parentCard = dropZone.closest('.symbol-card');
          if (parentCard) parentCard.className = 'symbol-card';
        }
        break;
      }
    }

    // Restore card in bank
    const bankCard = document.querySelector(`#labels-bank .name-card[data-label-id="${labelId}"]`);
    if (bankCard) {
      bankCard.classList.remove('is-placed');
      bankCard.removeAttribute('aria-disabled');
    }

    this.sound.playSnap();
    this.updateProgress();
  }

  clearSelection() {
    if (this.selectedCard) {
      this.selectedCard.classList.remove('selected-for-place');
      this.selectedCard = null;
    }
    this.dom.dropZones.forEach(dz => dz.classList.remove('target-ready'));
  }

  updateProgress() {
    const count = Object.keys(this.placements).length;
    this.dom.matchCount.textContent = count;
    const pct = Math.round((count / 9) * 100);
    this.dom.progressFill.style.width = `${pct}%`;
  }

  evaluateAllPlacements(showVisuals = true) {
    let correctCount = 0;
    for (const [targetId, labelId] of Object.entries(this.placements)) {
      const isCorrect = (targetId === labelId);
      if (isCorrect) correctCount++;

      if (showVisuals) {
        const dropZone = document.querySelector(`.drop-zone[data-target-id="${targetId}"]`);
        if (dropZone) {
          const parentCard = dropZone.closest('.symbol-card');
          if (parentCard) {
            parentCard.className = isCorrect ? 'symbol-card matched-correct' : 'symbol-card matched-incorrect';
          }
        }
      }
    }
    return correctCount;
  }

  checkAnswers() {
    const totalPlaced = Object.keys(this.placements).length;
    const correctCount = this.evaluateAllPlacements(true);

    if (this.timerRunning) {
      this.pauseTimer();
    }

    const timeSpent = this.totalSeconds - this.secondsRemaining;
    const timeRemainingStr = `${String(Math.floor(this.secondsRemaining / 60)).padStart(2, '0')}:${String(this.secondsRemaining % 60).padStart(2, '0')}`;

    if (correctCount === 9) {
      this.sound.playVictory();
      this.confetti.fire(3500);
      this.saveBestTime(timeSpent);
      this.showResultModal(true, correctCount, timeRemainingStr);
    } else {
      if (correctCount > 5) {
        this.sound.playCorrect();
      } else {
        this.sound.playWrong();
      }
      this.showResultModal(false, correctCount, timeRemainingStr);
    }
  }

  handleTimeUp() {
    this.sound.playWrong();
    const correctCount = this.evaluateAllPlacements(true);
    this.showResultModal(false, correctCount, '00:00', true);
  }

  // ---------------------------------------------------------------------------
  // RESULTS & BEST TIME
  // ---------------------------------------------------------------------------
  saveBestTime(secondsSpent) {
    const currentBest = localStorage.getItem('symbol_snap_best_time');
    if (!currentBest || secondsSpent < parseInt(currentBest, 10)) {
      localStorage.setItem('symbol_snap_best_time', secondsSpent);
      this.loadBestTime();
    }
  }

  loadBestTime() {
    const best = localStorage.getItem('symbol_snap_best_time');
    if (best) {
      const s = parseInt(best, 10);
      const mins = Math.floor(s / 60);
      const secs = s % 60;
      this.dom.bestTimeVal.textContent = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    } else {
      this.dom.bestTimeVal.textContent = '--:--';
    }
  }

  showResultModal(allCorrect, correctCount, timeStr, timeUp = false) {
    this.dom.resScore.textContent = `${correctCount} / 9`;
    this.dom.resTime.textContent = timeStr;

    if (allCorrect) {
      this.dom.resultIconWrap.textContent = '🏆';
      this.dom.resultTitle.textContent = '⚡ Circuit Master!';
      this.dom.resultMessage.textContent = `Magnificent! You correctly snapped all 9 circuit symbols with ${timeStr} left on the clock.`;
      this.dom.resRank.textContent = this.secondsRemaining >= 30 ? '🚀 Senior Engineer' : '💡 Lead Technician';
    } else if (timeUp) {
      this.dom.resultIconWrap.textContent = '⏰';
      this.dom.resultTitle.textContent = 'Time’s Up!';
      this.dom.resultMessage.textContent = `You matched ${correctCount} of 9 components before the 60-second limit expired.`;
      this.dom.resRank.textContent = correctCount >= 6 ? '⚡ Apprentice' : '🔍 Trainee';
    } else {
      this.dom.resultIconWrap.textContent = '📊';
      this.dom.resultTitle.textContent = 'Challenge Evaluated';
      this.dom.resultMessage.textContent = `You scored ${correctCount} / 9 correct. Review the highlighted cards or try again!`;
      this.dom.resRank.textContent = correctCount >= 7 ? '⚡ Apprentice' : '🔍 Trainee';
    }

    this.dom.modalResult.hidden = false;
  }

  // ---------------------------------------------------------------------------
  // DRAG AND DROP ENGINE (HTML5 Standard + Touch / Pointer Events Fallback)
  // ---------------------------------------------------------------------------
  setupDragAndDrop() {
    // HTML5 Drag on bank cards
    this.dom.nameCards.forEach(card => {
      card.addEventListener('dragstart', (e) => {
        if (card.classList.contains('is-placed')) {
          e.preventDefault();
          return;
        }
        this.sound.init();
        const labelId = card.getAttribute('data-label-id');
        e.dataTransfer.setData('text/plain', labelId);
        e.dataTransfer.effectAllowed = 'move';
        card.classList.add('is-dragging');
      });

      card.addEventListener('dragend', () => {
        card.classList.remove('is-dragging');
        this.dom.dropZones.forEach(dz => dz.classList.remove('drag-over'));
      });
    });

    // Drop zones event handlers
    this.dom.dropZones.forEach(zone => {
      zone.addEventListener('dragover', (e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        zone.classList.add('drag-over');
      });

      zone.addEventListener('dragleave', () => {
        zone.classList.remove('drag-over');
      });

      zone.addEventListener('drop', (e) => {
        e.preventDefault();
        zone.classList.remove('drag-over');
        const labelId = e.dataTransfer.getData('text/plain');
        const targetId = zone.getAttribute('data-target-id');
        if (labelId && targetId) {
          this.placeCardInSlot(labelId, targetId);
        }
      });
    });
  }

  // Pointer Events support for touch screens, iPads, and buttery smooth mobile dragging
  setupPointerDrag() {
    let activeDrag = null;

    const onPointerDown = (e) => {
      // Primary button / touch only
      if (e.button !== 0 && e.pointerType === 'mouse') return;
      const card = e.target.closest('.name-card');
      if (!card || card.classList.contains('is-placed')) return;

      // If clicked inside a drop slot, return it!
      if (card.classList.contains('slotted')) {
        const labelId = card.getAttribute('data-label-id');
        this.returnCardToBank(labelId);
        return;
      }

      this.sound.init();
      const labelId = card.getAttribute('data-label-id');
      const cardText = card.querySelector('.card-text').textContent;
      const rect = card.getBoundingClientRect();

      activeDrag = {
        pointerId: e.pointerId,
        labelId: labelId,
        startX: e.clientX,
        startY: e.clientY,
        hasMoved: false,
        element: card,
        proxy: null,
        cardText: cardText
      };
    };

    const onPointerMove = (e) => {
      if (!activeDrag || e.pointerId !== activeDrag.pointerId) return;

      const dist = Math.hypot(e.clientX - activeDrag.startX, e.clientY - activeDrag.startY);
      if (!activeDrag.hasMoved && dist > 5) {
        activeDrag.hasMoved = true;
        // Create floating proxy
        const proxy = document.createElement('div');
        proxy.className = 'floating-drag-proxy';
        proxy.textContent = activeDrag.cardText;
        document.body.appendChild(proxy);
        activeDrag.proxy = proxy;
        activeDrag.element.classList.add('is-dragging');
      }

      if (activeDrag.proxy) {
        activeDrag.proxy.style.left = `${e.clientX}px`;
        activeDrag.proxy.style.top = `${e.clientY}px`;

        // Check for hover over drop zone
        this.dom.dropZones.forEach(dz => dz.classList.remove('drag-over'));
        const elUnder = document.elementFromPoint(e.clientX, e.clientY);
        if (elUnder) {
          const dropZone = elUnder.closest('.drop-zone');
          if (dropZone) dropZone.classList.add('drag-over');
        }
      }
    };

    const onPointerUp = (e) => {
      if (!activeDrag || e.pointerId !== activeDrag.pointerId) return;

      if (activeDrag.hasMoved) {
        // Find target under point
        if (activeDrag.proxy) {
          activeDrag.proxy.remove();
        }
        activeDrag.element.classList.remove('is-dragging');

        const elUnder = document.elementFromPoint(e.clientX, e.clientY);
        if (elUnder) {
          const dropZone = elUnder.closest('.drop-zone');
          if (dropZone) {
            const targetId = dropZone.getAttribute('data-target-id');
            this.placeCardInSlot(activeDrag.labelId, targetId);
          }
        }
        this.dom.dropZones.forEach(dz => dz.classList.remove('drag-over'));
      } else {
        // It was a tap / click! Handle Tap-to-Place
        this.handleCardTap(activeDrag.element);
      }

      activeDrag = null;
    };

    const onPointerCancel = (e) => {
      if (!activeDrag || e.pointerId !== activeDrag.pointerId) return;
      if (activeDrag.proxy) activeDrag.proxy.remove();
      activeDrag.element.classList.remove('is-dragging');
      this.dom.dropZones.forEach(dz => dz.classList.remove('drag-over'));
      activeDrag = null;
    };

    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('pointermove', onPointerMove);
    document.addEventListener('pointerup', onPointerUp);
    document.addEventListener('pointercancel', onPointerCancel);
  }

  // ---------------------------------------------------------------------------
  // TAP-TO-PLACE & KEYBOARD ACCESSIBILITY
  // ---------------------------------------------------------------------------
  handleCardTap(card) {
    if (card.classList.contains('is-placed')) return;

    if (this.selectedCard === card) {
      this.clearSelection();
      return;
    }

    this.clearSelection();
    this.selectedCard = card;
    card.classList.add('selected-for-place');
    this.sound.playSnap();

    // Highlight all open drop zones
    this.dom.dropZones.forEach(dz => dz.classList.add('target-ready'));
  }

  setupEventListeners() {
    // Toolbar controls
    this.dom.btnTimerToggle.addEventListener('click', () => {
      if (this.timerRunning) {
        this.pauseTimer();
      } else {
        this.startTimer();
      }
    });

    this.dom.btnReset.addEventListener('click', () => {
      this.resetAll();
    });

    this.dom.btnCheck.addEventListener('click', () => {
      this.checkAnswers();
    });

    this.dom.btnShuffle.addEventListener('click', () => {
      this.shuffleCards();
      this.sound.playSnap();
    });

    this.dom.btnSoundToggle.addEventListener('click', () => {
      this.sound.toggle();
      this.updateSoundIcons();
    });

    this.dom.btnThemeToggle.addEventListener('click', () => {
      this.cycleTheme();
    });

    this.dom.btnPrint.addEventListener('click', () => {
      window.print();
    });

    // Mode Switch
    this.dom.modeChallenge.addEventListener('click', () => this.setMode('challenge'));
    this.dom.modePractice.addEventListener('click', () => this.setMode('practice'));

    // Drop zone tap for tap-to-place
    this.dom.dropZones.forEach(zone => {
      zone.addEventListener('click', () => {
        if (this.selectedCard) {
          const labelId = this.selectedCard.getAttribute('data-label-id');
          const targetId = zone.getAttribute('data-target-id');
          this.placeCardInSlot(labelId, targetId);
        }
      });

      // Keyboard support on drop zones
      zone.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          if (this.selectedCard) {
            const labelId = this.selectedCard.getAttribute('data-label-id');
            const targetId = zone.getAttribute('data-target-id');
            this.placeCardInSlot(labelId, targetId);
          }
        }
      });
    });

    // Keyboard support on bank cards
    this.dom.nameCards.forEach(card => {
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          this.handleCardTap(card);
        }
      });
    });

    // Modals
    this.dom.btnPairShare.addEventListener('click', () => {
      this.dom.modalPairShare.hidden = false;
    });

    this.dom.btnClosePair.addEventListener('click', () => {
      this.dom.modalPairShare.hidden = true;
    });

    this.dom.btnDonePair.addEventListener('click', () => {
      this.dom.modalPairShare.hidden = true;
    });

    this.dom.btnCloseResult.addEventListener('click', () => {
      this.dom.modalResult.hidden = true;
    });

    this.dom.btnReviewAnswers.addEventListener('click', () => {
      this.dom.modalResult.hidden = true;
    });

    this.dom.btnPlayAgain.addEventListener('click', () => {
      this.dom.modalResult.hidden = true;
      this.resetAll();
      this.startTimer();
    });

    // Component Info Dialogs
    this.dom.infoBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const symbolId = btn.getAttribute('data-info-for');
        this.openInfoModal(symbolId);
      });
    });

    this.dom.btnCloseInfo.addEventListener('click', () => {
      this.dom.modalInfo.hidden = true;
    });

    // Escape key closes open modals; arrow keys forward navigation to presentation player if embedded
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.clearSelection();
        this.dom.modalResult.hidden = true;
        this.dom.modalPairShare.hidden = true;
        this.dom.modalInfo.hidden = true;
        return;
      }

      if (e.key === 'ArrowRight' || e.key === 'PageDown') {
        const hasOpenModal = !this.dom.modalResult.hidden || !this.dom.modalPairShare.hidden || !this.dom.modalInfo.hidden;
        if (!hasOpenModal && window.parent && window.parent !== window) {
          try { window.parent.postMessage({ type: 'NEXT_SLIDE' }, '*'); } catch (_) {}
        }
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        const hasOpenModal = !this.dom.modalResult.hidden || !this.dom.modalPairShare.hidden || !this.dom.modalInfo.hidden;
        if (!hasOpenModal && window.parent && window.parent !== window) {
          try { window.parent.postMessage({ type: 'PREV_SLIDE' }, '*'); } catch (_) {}
        }
      }
    });

    // Click outside modal card to close
    [this.dom.modalResult, this.dom.modalPairShare, this.dom.modalInfo].forEach(modal => {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          modal.hidden = true;
        }
      });
    });
  }

  resetAll() {
    this.resetTimer();
    this.placements = {};
    this.clearSelection();

    // Reset all drop zones
    this.dom.dropZones.forEach(zone => {
      zone.innerHTML = '<span class="drop-zone-placeholder">Drop Name Here</span>';
      zone.classList.remove('has-card', 'drag-over', 'target-ready');
      const card = zone.closest('.symbol-card');
      if (card) card.className = 'symbol-card';
    });

    // Reset all bank cards
    this.dom.nameCards.forEach(card => {
      card.classList.remove('is-placed', 'selected-for-place', 'is-dragging');
      card.removeAttribute('aria-disabled');
    });

    this.updateProgress();
    this.shuffleCards();
    this.sound.playSnap();
  }

  shuffleCards() {
    const cards = Array.from(this.dom.labelsBank.children).filter(c => c.classList.contains('name-card'));
    for (let i = cards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      this.dom.labelsBank.appendChild(cards[j]);
    }
  }

  // ---------------------------------------------------------------------------
  // INTERACTIVE COMPONENT DETAILS & SANDBOX
  // ---------------------------------------------------------------------------
  openInfoModal(symbolId) {
    const data = COMPONENTS_DB[symbolId];
    if (!data) return;

    this.dom.infoCompTitle.textContent = data.name;
    this.dom.infoCategory.textContent = data.category;
    this.dom.infoDescription.textContent = data.description;
    this.dom.infoFunction.textContent = data.circuitFunction;
    this.dom.infoConnection.textContent = data.connection;
    this.dom.infoFormula.textContent = data.formula;
    this.dom.infoExample.textContent = data.example;
    this.dom.infoPreviewSlot.innerHTML = data.svg;

    this.buildSandbox(symbolId, data);
    this.dom.modalInfo.hidden = false;
  }

  buildSandbox(symbolId, data) {
    const stage = this.dom.sandboxStage;
    const controls = this.dom.sandboxControls;
    const readout = this.dom.sandboxReadout;

    stage.innerHTML = '';
    controls.innerHTML = '';
    readout.innerHTML = '';

    if (symbolId === 'open-switch') {
      let isOpen = true;
      const render = () => {
        stage.innerHTML = `
          <div style="display:flex; align-items:center; gap:24px;">
            <div style="width:120px; height:50px;">
              <svg viewBox="0 0 160 80" style="width:100%; height:100%;">
                <line x1="10" y1="44" x2="52" y2="44" stroke="currentColor" stroke-width="4" stroke-linecap="round"/>
                <line x1="52" y1="44" x2="${isOpen ? '106' : '108'}" y2="${isOpen ? '24' : '44'}" stroke="currentColor" stroke-width="4" stroke-linecap="round" style="transition:all 0.2s ease;"/>
                <line x1="108" y1="44" x2="150" y2="44" stroke="currentColor" stroke-width="4" stroke-linecap="round"/>
              </svg>
            </div>
            <div style="width:40px; height:40px; border-radius:50%; background:${isOpen ? '#64748b' : '#fbbf24'}; box-shadow:${isOpen ? 'none' : '0 0 20px #f59e0b'}; transition:all 0.2s ease; display:flex; align-items:center; justify-content:center; font-weight:800; color:#fff;">
              ${isOpen ? 'OFF' : 'ON'}
            </div>
          </div>
        `;
        readout.innerHTML = `Switch State: <strong>${isOpen ? 'OPEN (Air Gap, I = 0 A)' : 'CLOSED (Conducting, I = 0.5 A)'}</strong>`;
      };

      const toggleBtn = document.createElement('button');
      toggleBtn.className = 'btn btn-primary';
      toggleBtn.textContent = 'Toggle Switch Contact';
      toggleBtn.onclick = () => {
        isOpen = !isOpen;
        this.sound.playSnap();
        render();
      };

      controls.appendChild(toggleBtn);
      render();

    } else if (symbolId === 'lamp-bulb' || symbolId === 'variable-resistor' || symbolId === 'cell') {
      // Voltage / Resistance dimmer simulator
      let val = 50;
      const render = () => {
        const brightness = val / 100;
        const color = `rgba(251, 191, 36, ${Math.max(0.15, brightness)})`;
        const glow = brightness * 30;
        stage.innerHTML = `
          <div style="display:flex; align-items:center; gap:24px;">
            <div style="width:52px; height:52px; border-radius:50%; border:3px solid #1e293b; background:${color}; box-shadow:0 0 ${glow}px #f59e0b; transition:all 0.15s ease; display:flex; align-items:center; justify-content:center; font-size:1.4rem;">
              💡
            </div>
          </div>
        `;
        const volts = (val * 0.12).toFixed(1);
        const amps = (volts / 24).toFixed(2);
        readout.innerHTML = `Voltage: <strong>${volts} V</strong> | Current: <strong>${amps} A</strong> | Power: <strong>${(volts * amps).toFixed(2)} W</strong>`;
      };

      const label = document.createElement('span');
      label.textContent = 'Modulate Power Level:';
      label.style.fontWeight = '700';

      const slider = document.createElement('input');
      slider.type = 'range';
      slider.min = '0';
      slider.max = '100';
      slider.value = val;
      slider.className = 'sandbox-slider';
      slider.oninput = (e) => {
        val = parseInt(e.target.value, 10);
        render();
      };

      controls.appendChild(label);
      controls.appendChild(slider);
      render();

    } else if (symbolId === 'ldr') {
      let lux = 500;
      const render = () => {
        // Lux ranges 10 to 1000
        const isBright = lux > 400;
        const resistance = Math.round(1000000 / (lux * 2.5));
        stage.innerHTML = `
          <div style="display:flex; align-items:center; gap:20px;">
            <span style="font-size:2rem;">${lux > 600 ? '☀️' : (lux > 200 ? '⛅' : '🌙')}</span>
            <div style="background:${isBright ? '#f1f5f9' : '#0f172a'}; color:${isBright ? '#0f172a' : '#f8fafc'}; padding:6px 14px; border-radius:6px; font-weight:700;">
              Automatic Streetlight: ${isBright ? 'OFF (Daytime)' : '💡 ON (Night Time Activated)'}
            </div>
          </div>
        `;
        readout.innerHTML = `Light Intensity: <strong>${lux} Lux</strong> | LDR Resistance: <strong>${resistance.toLocaleString()} Ω</strong>`;
      };

      const label = document.createElement('span');
      label.textContent = 'Ambient Light Level:';
      label.style.fontWeight = '700';

      const slider = document.createElement('input');
      slider.type = 'range';
      slider.min = '10';
      slider.max = '1000';
      slider.value = lux;
      slider.className = 'sandbox-slider';
      slider.oninput = (e) => {
        lux = parseInt(e.target.value, 10);
        render();
      };

      controls.appendChild(label);
      controls.appendChild(slider);
      render();

    } else if (symbolId === 'led') {
      let forwardBiased = true;
      let selectedColor = '#ef4444'; // Red LED

      const render = () => {
        stage.innerHTML = `
          <div style="display:flex; align-items:center; gap:24px;">
            <div style="width:48px; height:48px; border-radius:50%; background:${forwardBiased ? selectedColor : '#64748b'}; box-shadow:${forwardBiased ? `0 0 25px ${selectedColor}` : 'none'}; border:3px solid #1e293b; display:flex; align-items:center; justify-content:center; color:#fff; font-weight:800; font-size:0.85rem;">
              ${forwardBiased ? 'EMIT' : 'BLOCK'}
            </div>
            <div style="font-size:0.9rem;">
              Bias: <strong>${forwardBiased ? 'Forward Biased (+ to Anode)' : 'Reverse Biased (Blocked!)'}</strong>
            </div>
          </div>
        `;
        readout.innerHTML = `Current: <strong>${forwardBiased ? '20 mA' : '0.00 µA'}</strong> | Diode State: <strong>${forwardBiased ? 'Emitting Photons' : 'Depletion Zone Barrier Active'}</strong>`;
      };

      const toggleBiasBtn = document.createElement('button');
      toggleBiasBtn.className = 'btn btn-primary';
      toggleBiasBtn.textContent = 'Reverse Polarity';
      toggleBiasBtn.onclick = () => {
        forwardBiased = !forwardBiased;
        this.sound.playSnap();
        render();
      };

      controls.appendChild(toggleBiasBtn);
      render();

    } else {
      // Default Ohm's Law / Resistance measurement
      stage.innerHTML = `
        <div style="text-align:center;">
          <span style="font-size:1.8rem;">⚡</span>
          <p style="font-weight:700; margin-top:4px;">Standardized Engineering Symbol Verified</p>
        </div>
      `;
      readout.innerHTML = `Complies with <strong>IEC 60617 / BS 3939 / GCSE / A-Level Physics Standards</strong>`;
    }
  }
}

// Instantiate on DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
  window.symbolSnapApp = new SymbolSnapApp();
});
