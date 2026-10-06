/**
 * Knowledge Checkpoint: Sequence Analysis
 * Core Application Engine
 */

(function () {
  'use strict';

  // ==========================================================================
  // 1. Biological Data & Codon Translation Dictionary
  // ==========================================================================

  // Universal Genetic Code (mRNA 5'->3' to Amino Acid)
  const CODON_TABLE = {
    // U-family
    'UUU': { aa: 'Phe', name: 'Phenylalanine', prop: 'hydrophobic' },
    'UUC': { aa: 'Phe', name: 'Phenylalanine', prop: 'hydrophobic' },
    'UUA': { aa: 'Leu', name: 'Leucine', prop: 'hydrophobic' },
    'UUG': { aa: 'Leu', name: 'Leucine', prop: 'hydrophobic' },
    'UCU': { aa: 'Ser', name: 'Serine', prop: 'polar' },
    'UCC': { aa: 'Ser', name: 'Serine', prop: 'polar' },
    'UCA': { aa: 'Ser', name: 'Serine', prop: 'polar' },
    'UCG': { aa: 'Ser', name: 'Serine', prop: 'polar' },
    'UAU': { aa: 'Tyr', name: 'Tyrosine', prop: 'polar' },
    'UAC': { aa: 'Tyr', name: 'Tyrosine', prop: 'polar' },
    'UAA': { aa: 'Stop', name: 'Ochre (Stop)', prop: 'stop' },
    'UAG': { aa: 'Stop', name: 'Amber (Stop)', prop: 'stop' },
    'UGU': { aa: 'Cys', name: 'Cysteine', prop: 'polar' },
    'UGC': { aa: 'Cys', name: 'Cysteine', prop: 'polar' },
    'UGA': { aa: 'Stop', name: 'Opal (Stop)', prop: 'stop' },
    'UGG': { aa: 'Trp', name: 'Tryptophan', prop: 'hydrophobic' },

    // C-family
    'CUU': { aa: 'Leu', name: 'Leucine', prop: 'hydrophobic' },
    'CUC': { aa: 'Leu', name: 'Leucine', prop: 'hydrophobic' },
    'CUA': { aa: 'Leu', name: 'Leucine', prop: 'hydrophobic' },
    'CUG': { aa: 'Leu', name: 'Leucine', prop: 'hydrophobic' },
    'CCU': { aa: 'Pro', name: 'Proline', prop: 'hydrophobic' },
    'CCC': { aa: 'Pro', name: 'Proline', prop: 'hydrophobic' },
    'CCA': { aa: 'Pro', name: 'Proline', prop: 'hydrophobic' },
    'CCG': { aa: 'Pro', name: 'Proline', prop: 'hydrophobic' },
    'CAU': { aa: 'His', name: 'Histidine', prop: 'basic' },
    'CAC': { aa: 'His', name: 'Histidine', prop: 'basic' },
    'CAA': { aa: 'Gln', name: 'Glutamine', prop: 'polar' },
    'CAG': { aa: 'Gln', name: 'Glutamine', prop: 'polar' },
    'CGU': { aa: 'Arg', name: 'Arginine', prop: 'basic' },
    'CGC': { aa: 'Arg', name: 'Arginine', prop: 'basic' },
    'CGA': { aa: 'Arg', name: 'Arginine', prop: 'basic' },
    'CGG': { aa: 'Arg', name: 'Arginine', prop: 'basic' },

    // A-family
    'AUU': { aa: 'Ile', name: 'Isoleucine', prop: 'hydrophobic' },
    'AUC': { aa: 'Ile', name: 'Isoleucine', prop: 'hydrophobic' },
    'AUA': { aa: 'Ile', name: 'Isoleucine', prop: 'hydrophobic' },
    'AUG': { aa: 'Met', name: 'Methionine (Start)', prop: 'start' },
    'ACU': { aa: 'Thr', name: 'Threonine', prop: 'polar' },
    'ACC': { aa: 'Thr', name: 'Threonine', prop: 'polar' },
    'ACA': { aa: 'Thr', name: 'Threonine', prop: 'polar' },
    'ACG': { aa: 'Thr', name: 'Threonine', prop: 'polar' },
    'AAU': { aa: 'Asn', name: 'Asparagine', prop: 'polar' },
    'AAC': { aa: 'Asn', name: 'Asparagine', prop: 'polar' },
    'AAA': { aa: 'Lys', name: 'Lysine', prop: 'basic' },
    'AAG': { aa: 'Lys', name: 'Lysine', prop: 'basic' },
    'AGU': { aa: 'Ser', name: 'Serine', prop: 'polar' },
    'AGC': { aa: 'Ser', name: 'Serine', prop: 'polar' },
    'AGA': { aa: 'Arg', name: 'Arginine', prop: 'basic' },
    'AGG': { aa: 'Arg', name: 'Arginine', prop: 'basic' },

    // G-family
    'GUU': { aa: 'Val', name: 'Valine', prop: 'hydrophobic' },
    'GUC': { aa: 'Val', name: 'Valine', prop: 'hydrophobic' },
    'GUA': { aa: 'Val', name: 'Valine', prop: 'hydrophobic' },
    'GUG': { aa: 'Val', name: 'Valine', prop: 'hydrophobic' },
    'GCU': { aa: 'Ala', name: 'Alanine', prop: 'hydrophobic' },
    'GCC': { aa: 'Ala', name: 'Alanine', prop: 'hydrophobic' },
    'GCA': { aa: 'Ala', name: 'Alanine', prop: 'hydrophobic' },
    'GCG': { aa: 'Ala', name: 'Alanine', prop: 'hydrophobic' },
    'GAU': { aa: 'Asp', name: 'Aspartate', prop: 'acidic' },
    'GAC': { aa: 'Asp', name: 'Aspartate', prop: 'acidic' },
    'GAA': { aa: 'Glu', name: 'Glutamate', prop: 'acidic' },
    'GAG': { aa: 'Glu', name: 'Glutamate', prop: 'acidic' },
    'GGU': { aa: 'Gly', name: 'Glycine', prop: 'hydrophobic' },
    'GGC': { aa: 'Gly', name: 'Glycine', prop: 'hydrophobic' },
    'GGA': { aa: 'Gly', name: 'Glycine', prop: 'hydrophobic' },
    'GGG': { aa: 'Gly', name: 'Glycine', prop: 'hydrophobic' }
  };

  /**
   * Transcribe a 3'->5' DNA template strand into 5'->3' mRNA
   * T -> A, A -> U, C -> G, G -> C
   */
  function transcribeDnaTemplate(dna) {
    const cleanDna = dna.replace(/[^ATCGatcg]/g, '').toUpperCase();
    const map = { 'T': 'A', 'A': 'U', 'C': 'G', 'G': 'C' };
    return cleanDna.split('').map(b => map[b] || 'N').join('');
  }

  /**
   * Transcribe an mRNA codon back to its 3'->5' DNA template codon
   */
  function mrnaToDnaTemplate(mrna) {
    const map = { 'A': 'T', 'U': 'A', 'G': 'C', 'C': 'G' };
    return mrna.toUpperCase().split('').map(b => map[b] || 'N').join('');
  }

  /**
   * Translate mRNA into amino acid peptide chain
   */
  function translateMrna(mrna) {
    const clean = mrna.replace(/[^AUGCaugc]/g, '').toUpperCase();
    const peptides = [];
    for (let i = 0; i < clean.length; i += 3) {
      if (i + 3 <= clean.length) {
        const codon = clean.substring(i, i + 3);
        const match = CODON_TABLE[codon];
        if (match) {
          peptides.push(match.aa);
          if (match.aa === 'Stop') {
            break;
          }
        } else {
          peptides.push('?');
        }
      } else {
        // Trailing incomplete codon (e.g. 1 or 2 bases left due to frameshift)
        peptides.push('(' + clean.substring(i) + ')');
      }
    }
    return peptides;
  }

  /**
   * Translate 3'->5' DNA Template directly
   */
  function translateDnaTemplate(dna) {
    const mrna = transcribeDnaTemplate(dna);
    return translateMrna(mrna);
  }

  // ==========================================================================
  // 2. Curated Checkpoint Levels (Level 1 Matches Attached Screenshot)
  // ==========================================================================

  const CHECKPOINTS = [
    {
      id: 'checkpoint-1',
      title: 'Checkpoint 1 (Image Specimen)',
      task: 'Compare the wild-type DNA sequence to Mutants X and Y.',
      wildType: {
        dna: 'TAC-TTC-AAA-ATC',
        mrna: 'AUG-AAG-UUU-UAG',
        peptide: 'Met-Lys-Phe-Stop'
      },
      mutants: [
        {
          id: 'mut-x',
          name: 'Mutant X',
          dna: 'TAC-ATC-AAA-ATC',
          initialPill: 'SNV / Missense', // Initial placeholder matching image
          correctClass: 'SNV',
          // Both Nonsense (template ATC -> UAG Stop) and Missense (as in the screenshot pill) are valid with thorough explanations!
          acceptableConsequences: ['Nonsense', 'Missense'],
          primaryConsequence: 'Nonsense',
          explanation: `
            <strong>Mutant X Analysis:</strong> Codon 2 is mutated from <code>TTC</code> to <code>ATC</code> (a single nucleotide substitution T &rarr; A).
            <ul>
              <li><strong>Step 1:</strong> It is an <strong>SNV</strong> (Single Nucleotide Variant) because only 1 base was substituted with no insertion or deletion.</li>
              <li><strong>Step 2:</strong> In the 3'&rarr;5' template strand, <code>ATC</code> transcribes to mRNA <code>UAG</code>, which is a premature <strong>Stop codon</strong>. This biologically causes a <strong>Nonsense</strong> mutation (truncating the protein). Note: In coding strand conventions (ATC &rarr; Ile), this would be classified as <strong>Missense</strong>. Both classifications are acknowledged!</li>
            </ul>
          `
        },
        {
          id: 'mut-y',
          name: 'Mutant Y',
          dna: 'TAC-TCA-AAA-TC',
          initialPill: 'Deletion / Frameshift',
          correctClass: 'Deletion',
          acceptableConsequences: ['Frameshift'],
          primaryConsequence: 'Frameshift',
          explanation: `
            <strong>Mutant Y Analysis:</strong> Codon 2 lost a single 'T' nucleotide (<code>TTC</code> was deleted to <code>TC</code>).
            <ul>
              <li><strong>Step 1:</strong> It is a <strong>Deletion (Indel)</strong> because a base was lost and the total length shortened.</li>
              <li><strong>Step 2:</strong> Because 1 nucleotide was removed (not a multiple of 3), the triplet reading frame was completely altered from that point onwards (<code>TCA</code>, <code>AAA</code>, <code>TC...</code>). This is a classical <strong>Frameshift</strong> mutation that disrupts all subsequent amino acids!</li>
            </ul>
          `
        }
      ]
    },
    {
      id: 'checkpoint-2',
      title: 'Checkpoint 2: Silent vs Missense',
      task: 'Identify how single base substitutions affect the protein sequence differently.',
      wildType: {
        dna: 'TAC-TTC-AAA-ATC',
        mrna: 'AUG-AAG-UUU-UAG',
        peptide: 'Met-Lys-Phe-Stop'
      },
      mutants: [
        {
          id: 'mut-a',
          name: 'Mutant A',
          dna: 'TAC-TTT-AAA-ATC',
          initialPill: '[ Select Classification ]',
          correctClass: 'SNV',
          acceptableConsequences: ['Silent'],
          primaryConsequence: 'Silent',
          explanation: `
            <strong>Mutant A Analysis:</strong> Codon 2 changed from <code>TTC</code> to <code>TTT</code> (C &rarr; T substitution).
            <ul>
              <li><strong>Step 1:</strong> Single base change with constant length = <strong>SNV</strong>.</li>
              <li><strong>Step 2:</strong> Template <code>TTC</code> transcribes to mRNA <code>AAG</code> (Lys), while template <code>TTT</code> transcribes to mRNA <code>AAA</code> (also Lys!). Because both codons specify <strong>Lysine</strong> (genetic code degeneracy), the protein remains identical: <strong>Silent / Synonymous</strong>.</li>
            </ul>
          `
        },
        {
          id: 'mut-b',
          name: 'Mutant B',
          dna: 'TAC-TTC-AGA-ATC',
          initialPill: '[ Select Classification ]',
          correctClass: 'SNV',
          acceptableConsequences: ['Missense'],
          primaryConsequence: 'Missense',
          explanation: `
            <strong>Mutant B Analysis:</strong> Codon 3 changed from <code>AAA</code> to <code>AGA</code> (A &rarr; G substitution).
            <ul>
              <li><strong>Step 1:</strong> Single nucleotide substitution = <strong>SNV</strong>.</li>
              <li><strong>Step 2:</strong> Template <code>AAA</code> transcribes to mRNA <code>UUU</code> (Phe), whereas template <code>AGA</code> transcribes to mRNA <code>UCU</code> (Ser). Since Phenylalanine is replaced by Serine, this is a <strong>Missense</strong> mutation.</li>
            </ul>
          `
        }
      ]
    },
    {
      id: 'checkpoint-3',
      title: 'Checkpoint 3: Indel Frame Dynamics',
      task: 'Compare frameshift-causing indels with in-frame triplet deletions.',
      wildType: {
        dna: 'TAC-TTC-AAA-ATC',
        mrna: 'AUG-AAG-UUU-UAG',
        peptide: 'Met-Lys-Phe-Stop'
      },
      mutants: [
        {
          id: 'mut-c',
          name: 'Mutant C',
          dna: 'TAC-ATT-CAA-AAT-C',
          initialPill: '[ Select Classification ]',
          correctClass: 'Insertion',
          acceptableConsequences: ['Frameshift'],
          primaryConsequence: 'Frameshift',
          explanation: `
            <strong>Mutant C Analysis:</strong> An 'A' nucleotide was inserted right after the start codon.
            <ul>
              <li><strong>Step 1:</strong> Adding a base = <strong>Insertion (Indel)</strong>.</li>
              <li><strong>Step 2:</strong> Adding 1 base shifts the entire downstream reading frame (1 &ne; multiple of 3), scrambling all following codons. This is a <strong>Frameshift</strong> mutation.</li>
            </ul>
          `
        },
        {
          id: 'mut-d',
          name: 'Mutant D',
          dna: 'TAC-AAA-ATC',
          initialPill: '[ Select Classification ]',
          correctClass: 'Deletion',
          acceptableConsequences: ['In-frame Indel'],
          primaryConsequence: 'In-frame Indel',
          explanation: `
            <strong>Mutant D Analysis:</strong> The entire second codon <code>TTC</code> was deleted.
            <ul>
              <li><strong>Step 1:</strong> Nucleotides removed = <strong>Deletion (Indel)</strong>.</li>
              <li><strong>Step 2:</strong> Exactly 3 bases (one full triplet codon) were removed! The downstream codon <code>AAA</code> and Stop codon <code>ATC</code> remain perfectly aligned in frame. The protein simply loses Lysine without scrambling the rest. This is an <strong>In-frame Indel</strong> (similar to &Delta;F508 in cystic fibrosis).</li>
            </ul>
          `
        }
      ]
    },
    {
      id: 'checkpoint-4',
      title: 'Checkpoint 4: Termination Disruptions',
      task: 'Analyze premature termination vs. non-stop read-through mutations.',
      wildType: {
        dna: 'TAC-TTC-AAA-ATC',
        mrna: 'AUG-AAG-UUU-UAG',
        peptide: 'Met-Lys-Phe-Stop'
      },
      mutants: [
        {
          id: 'mut-e',
          name: 'Mutant E',
          dna: 'TAC-ATC-AAA-ATC',
          initialPill: '[ Select Classification ]',
          correctClass: 'SNV',
          acceptableConsequences: ['Nonsense'],
          primaryConsequence: 'Nonsense',
          explanation: `
            <strong>Mutant E Analysis:</strong> Codon 2 became <code>ATC</code> (mRNA <code>UAG</code> = Stop).
            <ul>
              <li><strong>Step 1:</strong> <strong>SNV</strong> substitution.</li>
              <li><strong>Step 2:</strong> Introduction of a premature Stop codon truncating the peptide after only 1 amino acid = <strong>Nonsense</strong> mutation.</li>
            </ul>
          `
        },
        {
          id: 'mut-f',
          name: 'Mutant F',
          dna: 'TAC-TTC-AAA-ACC',
          initialPill: '[ Select Classification ]',
          correctClass: 'SNV',
          acceptableConsequences: ['Missense'],
          primaryConsequence: 'Missense',
          explanation: `
            <strong>Mutant F Analysis:</strong> Stop codon <code>ATC</code> (mRNA <code>UAG</code>) was mutated to <code>ACC</code> (mRNA <code>UGG</code> = Trp).
            <ul>
              <li><strong>Step 1:</strong> <strong>SNV</strong> substitution.</li>
              <li><strong>Step 2:</strong> The normal termination signal is converted into an amino acid (Tryptophan), allowing translation to read through into the 3' UTR. Classified as <strong>Missense / Nonstop mutation</strong>.</li>
            </ul>
          `
        }
      ]
    }
  ];

  // ==========================================================================
  // 3. State Management
  // ==========================================================================

  const state = {
    currentCheckpointIndex: 0,
    userSelections: {}, // mutantId -> { class: string, consequence: string }
    showMrna: false,
    soundEnabled: true,
    theme: 'light',
    activePopoverTarget: null,
    drill: {
      score: 0,
      streak: 0,
      currentQuestion: null,
      selectedClass: null,
      selectedConsequence: null
    },
    studio: {
      templateDna: 'TAC-TTC-AAA-ATC'
    }
  };

  // ==========================================================================
  // 4. Web Audio Synthesizer (No external audio assets needed!)
  // ==========================================================================

  let audioCtx = null;

  function initAudio() {
    if (!audioCtx && (window.AudioContext || window.webkitAudioContext)) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
  }

  function playTone(freq, type = 'sine', duration = 0.12, gainVal = 0.1) {
    if (!state.soundEnabled) return;
    try {
      initAudio();
      if (!audioCtx) return;
      if (audioCtx.state === 'suspended') {
        audioCtx.resume();
      }
      const osc = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);

      gainNode.gain.setValueAtTime(gainVal, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);

      osc.connect(gainNode);
      gainNode.connect(audioCtx.destination);

      osc.start();
      osc.stop(audioCtx.currentTime + duration);
    } catch (e) {
      console.warn('Audio feedback failed', e);
    }
  }

  function playSuccessSound() {
    if (!state.soundEnabled) return;
    playTone(523.25, 'triangle', 0.1, 0.08); // C5
    setTimeout(() => playTone(659.25, 'triangle', 0.1, 0.08), 80); // E5
    setTimeout(() => playTone(783.99, 'triangle', 0.22, 0.12), 160); // G5
  }

  function playIncorrectSound() {
    if (!state.soundEnabled) return;
    playTone(280, 'sawtooth', 0.15, 0.06);
    setTimeout(() => playTone(240, 'sawtooth', 0.2, 0.06), 100);
  }

  function playClickSound() {
    if (!state.soundEnabled) return;
    playTone(800, 'sine', 0.04, 0.03);
  }

  // ==========================================================================
  // 5. DOM Elements Cache
  // ==========================================================================

  const dom = {
    // Navigation & Tabs
    tabCheckpoint: document.getElementById('tab-checkpoint'),
    tabStudio: document.getElementById('tab-studio'),
    tabDrill: document.getElementById('tab-drill'),
    viewCheckpoint: document.getElementById('view-checkpoint'),
    viewStudio: document.getElementById('view-studio'),
    viewDrill: document.getElementById('view-drill'),

    // Checkpoint Controls
    checkpointPillsContainer: document.getElementById('checkpoint-pills-container'),
    taskDescriptionText: document.getElementById('task-description-text'),
    workspaceLevelIndicator: document.getElementById('workspace-level-indicator'),
    wtCodonsDisplay: document.getElementById('wt-codons-display'),
    wtPeptideDisplay: document.getElementById('wt-peptide-display'),
    wtMrnaRow: document.getElementById('wt-mrna-row'),
    mutantRowsContainer: document.getElementById('mutant-rows-container'),

    // Action Buttons
    btnCheckAnswers: document.getElementById('btn-check-answers'),
    btnResetAnswers: document.getElementById('btn-reset-answers'),
    btnShowSolution: document.getElementById('btn-show-solution'),
    btnNextCheckpoint: document.getElementById('btn-next-checkpoint'),
    btnShowHint: document.getElementById('btn-show-hint'),
    hintBox: document.getElementById('hint-box'),
    hintText: document.getElementById('hint-text'),
    btnToggleMrnaView: document.getElementById('btn-toggle-mrna-view'),
    mrnaToggleText: document.getElementById('mrna-toggle-text'),
    btnAlignmentView: document.getElementById('btn-alignment-view'),
    alignmentPanel: document.getElementById('alignment-inspector-panel'),
    alignmentGrid: document.getElementById('alignment-visualization'),
    btnCloseAlignment: document.getElementById('btn-close-alignment'),

    // Feedback Panel
    feedbackPanel: document.getElementById('feedback-panel'),
    feedbackHeadline: document.getElementById('feedback-headline'),
    feedbackStatusBadge: document.getElementById('feedback-status-badge'),
    feedbackBody: document.getElementById('feedback-body'),
    btnCloseFeedback: document.getElementById('btn-close-feedback'),

    // Selection Popover
    popover: document.getElementById('selection-popover'),
    popoverClassSelect: document.getElementById('popover-class-select'),
    popoverConsequenceSelect: document.getElementById('popover-consequence-select'),
    popoverPreviewPill: document.getElementById('popover-preview-pill'),
    btnPopoverApply: document.getElementById('btn-popover-apply'),
    btnPopoverCancel: document.getElementById('btn-popover-cancel'),
    btnClosePopover: document.getElementById('btn-close-popover'),

    // Modals
    modalCodon: document.getElementById('modal-codon-table'),
    btnOpenCodon: document.getElementById('btn-open-codon-table'),
    btnCloseCodon: document.getElementById('btn-close-codon-modal'),
    btnDoneCodon: document.getElementById('btn-done-codon-modal'),
    codonCardsGrid: document.getElementById('codon-cards-grid'),
    codonSearchInput: document.getElementById('codon-search-input'),
    btnToggleCodonStrand: document.getElementById('btn-toggle-codon-strand'),
    codonStrandLabel: document.getElementById('codon-strand-label'),
    codonFilters: document.getElementById('codon-filters'),

    modalGuide: document.getElementById('modal-guide'),
    btnOpenGuide: document.getElementById('btn-open-guide'),
    btnCloseGuide: document.getElementById('btn-close-guide-modal'),
    btnDoneGuide: document.getElementById('btn-done-guide-modal'),

    // Theme & Sound
    btnToggleTheme: document.getElementById('btn-toggle-theme'),
    iconSun: document.getElementById('icon-sun'),
    iconMoon: document.getElementById('icon-moon'),
    btnToggleSound: document.getElementById('btn-toggle-sound'),
    iconSoundOn: document.getElementById('icon-sound-on'),
    iconSoundOff: document.getElementById('icon-sound-off'),

    // Mutation Studio Elements
    studioPresetSelect: document.getElementById('studio-preset-select'),
    studioDnaStrip: document.getElementById('studio-dna-strip'),
    studioMrnaStrip: document.getElementById('studio-mrna-strip'),
    studioPeptideStrip: document.getElementById('studio-peptide-strip'),
    studioMutationBadge: document.getElementById('studio-mutation-badge'),
    studioClassVal: document.getElementById('studio-class-val'),
    studioConsequenceVal: document.getElementById('studio-consequence-val'),
    studioFrameVal: document.getElementById('studio-frame-val'),
    studioLengthVal: document.getElementById('studio-length-val'),
    studioExplanationText: document.getElementById('studio-explanation-text'),
    btnStudioSnv: document.getElementById('btn-studio-snv'),
    btnStudioDel: document.getElementById('btn-studio-del'),
    btnStudioIns: document.getElementById('btn-studio-ins'),
    btnStudioReset: document.getElementById('btn-studio-reset'),

    // Drill Mode Elements
    drillScore: document.getElementById('drill-score'),
    drillStreak: document.getElementById('drill-streak'),
    drillWtCode: document.getElementById('drill-wt-code'),
    drillWtPeptide: document.getElementById('drill-wt-peptide'),
    drillMutCode: document.getElementById('drill-mut-code'),
    drillMutPeptide: document.getElementById('drill-mut-peptide'),
    drillClassOptions: document.getElementById('drill-class-options'),
    drillConsequenceOptions: document.getElementById('drill-consequence-options'),
    btnDrillSubmit: document.getElementById('btn-drill-submit'),
    btnDrillNext: document.getElementById('btn-drill-next'),
    drillFeedbackBox: document.getElementById('drill-feedback-box'),

    // Live Announcer
    liveAnnouncer: document.getElementById('live-announcer')
  };

  function announce(msg) {
    if (dom.liveAnnouncer) {
      dom.liveAnnouncer.textContent = msg;
    }
  }

  // ==========================================================================
  // 6. Checkpoint View Rendering
  // ==========================================================================

  function renderCheckpointNavPills() {
    dom.checkpointPillsContainer.innerHTML = '';
    CHECKPOINTS.forEach((cp, idx) => {
      const btn = document.createElement('button');
      btn.className = `level-pill-btn ${idx === state.currentCheckpointIndex ? 'active' : ''}`;
      btn.id = `pill-level-${idx + 1}`;
      btn.textContent = `Checkpoint ${idx + 1}`;
      btn.setAttribute('aria-pressed', idx === state.currentCheckpointIndex ? 'true' : 'false');
      btn.addEventListener('click', () => {
        playClickSound();
        loadCheckpoint(idx);
      });
      dom.checkpointPillsContainer.appendChild(btn);
    });
  }

  function loadCheckpoint(index) {
    state.currentCheckpointIndex = index;
    const cp = CHECKPOINTS[index];

    // Reset feedback & alignment panels
    dom.feedbackPanel.classList.add('hidden');
    dom.alignmentPanel.classList.add('hidden');
    dom.hintBox.classList.add('hidden');
    dom.btnNextCheckpoint.classList.add('hidden');

    // Update text
    dom.taskDescriptionText.textContent = cp.task;
    dom.workspaceLevelIndicator.textContent = `Level ${index + 1} of ${CHECKPOINTS.length}`;

    // Render Wild-type
    dom.wtCodonsDisplay.innerHTML = `<code class="dna-code wt-code">${cp.wildType.dna}</code>`;
    dom.wtPeptideDisplay.textContent = cp.wildType.peptide;

    // Set initial user selections for this checkpoint
    state.userSelections = {};
    cp.mutants.forEach(m => {
      // In Checkpoint 1, populate the pill with the text shown in the screenshot so the user sees the exact UI!
      if (cp.id === 'checkpoint-1') {
        if (m.id === 'mut-x') {
          state.userSelections[m.id] = { class: 'SNV', consequence: 'Missense' };
        } else if (m.id === 'mut-y') {
          state.userSelections[m.id] = { class: 'Deletion', consequence: 'Frameshift' };
        }
      } else {
        state.userSelections[m.id] = { class: '', consequence: '' };
      }
    });

    renderMutantRows(cp);
    renderCheckpointNavPills();
    announce(`Loaded ${cp.title}`);
  }

  function renderMutantRows(cp) {
    dom.mutantRowsContainer.innerHTML = '';

    cp.mutants.forEach((mutant, i) => {
      const row = document.createElement('div');
      row.className = 'sequence-row mutant-row';
      row.id = `row-${mutant.id}`;

      const userSel = state.userSelections[mutant.id] || { class: '', consequence: '' };
      let pillText = '[ Select Classification ]';
      let isUnselected = true;

      if (userSel.class || userSel.consequence) {
        const cls = userSel.class || 'Select Class';
        const con = userSel.consequence || 'Select Consequence';
        pillText = `[ ${cls} / ${con} ]`;
        isUnselected = false;
      }

      row.innerHTML = `
        <div class="seq-content-group">
          <span class="seq-label" id="label-${mutant.id}">${mutant.name}:</span>
          <div class="sequence-codons-wrapper">
            <code class="dna-code" id="code-${mutant.id}">${mutant.dna}</code>
          </div>
          <span class="seq-arrow" aria-hidden="true">&rarr;</span>
          <button 
            type="button"
            id="pill-${mutant.id}"
            class="classification-pill-btn ${isUnselected ? 'unselected' : ''}"
            aria-haspopup="dialog"
            aria-expanded="false"
            aria-labelledby="label-${mutant.id} pill-${mutant.id}"
            data-mutant-id="${mutant.id}"
          >
            <span class="pill-text">${pillText}</span>
            <span class="pill-status-icon" aria-hidden="true"></span>
          </button>
        </div>
      `;

      // Event listener for opening the classification popover
      const pillBtn = row.querySelector('.classification-pill-btn');
      pillBtn.addEventListener('click', (e) => {
        playClickSound();
        openClassificationPopover(pillBtn, mutant);
      });

      dom.mutantRowsContainer.appendChild(row);

      // Add divider if not the last mutant
      if (i < cp.mutants.length - 1) {
        const divider = document.createElement('div');
        divider.className = 'seq-divider';
        divider.setAttribute('aria-hidden', 'true');
        dom.mutantRowsContainer.appendChild(divider);
      }
    });
  }

  // ==========================================================================
  // 7. Interactive Classification Popover
  // ==========================================================================

  function openClassificationPopover(targetBtn, mutant) {
    state.activePopoverTarget = { targetBtn, mutant };
    const userSel = state.userSelections[mutant.id] || { class: '', consequence: '' };

    dom.popoverClassSelect.value = userSel.class || '';
    dom.popoverConsequenceSelect.value = userSel.consequence || '';

    updatePopoverPreview();

    // Position popover relative to target button
    dom.popover.classList.remove('hidden');
    targetBtn.setAttribute('aria-expanded', 'true');

    const rect = targetBtn.getBoundingClientRect();
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const scrollLeft = window.scrollX || document.documentElement.scrollLeft;

    let top = rect.bottom + scrollTop + 6;
    let left = rect.left + scrollLeft;

    // Check right viewport overflow
    if (left + 340 > window.innerWidth) {
      left = Math.max(10, window.innerWidth - 350);
    }

    dom.popover.style.top = `${top}px`;
    dom.popover.style.left = `${left}px`;

    dom.popoverClassSelect.focus();
  }

  function updatePopoverPreview() {
    const cls = dom.popoverClassSelect.value;
    const con = dom.popoverConsequenceSelect.value;
    if (cls && con) {
      dom.popoverPreviewPill.textContent = `[ ${cls} / ${con} ]`;
    } else if (cls) {
      dom.popoverPreviewPill.textContent = `[ ${cls} / Select Consequence ]`;
    } else if (con) {
      dom.popoverPreviewPill.textContent = `[ Select Class / ${con} ]`;
    } else {
      dom.popoverPreviewPill.textContent = '[ Select both ]';
    }
  }

  function closeClassificationPopover() {
    dom.popover.classList.add('hidden');
    if (state.activePopoverTarget && state.activePopoverTarget.targetBtn) {
      state.activePopoverTarget.targetBtn.setAttribute('aria-expanded', 'false');
      state.activePopoverTarget.targetBtn.focus();
    }
    state.activePopoverTarget = null;
  }

  dom.popoverClassSelect.addEventListener('change', updatePopoverPreview);
  dom.popoverConsequenceSelect.addEventListener('change', updatePopoverPreview);

  dom.btnPopoverApply.addEventListener('click', () => {
    if (!state.activePopoverTarget) return;
    const { targetBtn, mutant } = state.activePopoverTarget;
    const cls = dom.popoverClassSelect.value;
    const con = dom.popoverConsequenceSelect.value;

    state.userSelections[mutant.id] = { class: cls, consequence: con };

    const pillTextSpan = targetBtn.querySelector('.pill-text');
    if (cls && con) {
      pillTextSpan.textContent = `[ ${cls} / ${con} ]`;
      targetBtn.classList.remove('unselected');
    } else if (cls || con) {
      pillTextSpan.textContent = `[ ${cls || 'Class'} / ${con || 'Consequence'} ]`;
      targetBtn.classList.remove('unselected');
    } else {
      pillTextSpan.textContent = '[ Select Classification ]';
      targetBtn.classList.add('unselected');
    }

    // Reset status styling if was previously checked
    targetBtn.classList.remove('is-correct', 'is-incorrect');
    targetBtn.querySelector('.pill-status-icon').textContent = '';

    playClickSound();
    closeClassificationPopover();
  });

  dom.btnPopoverCancel.addEventListener('click', closeClassificationPopover);
  dom.btnClosePopover.addEventListener('click', closeClassificationPopover);

  // Close popover when clicking outside
  document.addEventListener('click', (e) => {
    if (!dom.popover.classList.contains('hidden')) {
      if (!dom.popover.contains(e.target) && !e.target.closest('.classification-pill-btn')) {
        closeClassificationPopover();
      }
    }
  });

  // ==========================================================================
  // 8. Checking Answers & Detailed Feedback
  // ==========================================================================

  dom.btnCheckAnswers.addEventListener('click', () => {
    const cp = CHECKPOINTS[state.currentCheckpointIndex];
    let allCorrect = true;
    let anyUnanswered = false;
    const feedbackItems = [];

    cp.mutants.forEach(mutant => {
      const row = document.getElementById(`row-${mutant.id}`);
      const pillBtn = row.querySelector('.classification-pill-btn');
      const iconSpan = pillBtn.querySelector('.pill-status-icon');
      const userSel = state.userSelections[mutant.id] || { class: '', consequence: '' };

      if (!userSel.class || !userSel.consequence) {
        anyUnanswered = true;
      }

      const isClassCorrect = userSel.class === mutant.correctClass;
      const isConsequenceCorrect = mutant.acceptableConsequences.includes(userSel.consequence);

      if (isClassCorrect && isConsequenceCorrect) {
        pillBtn.classList.remove('is-incorrect', 'unselected');
        pillBtn.classList.add('is-correct');
        iconSpan.innerHTML = ' ✓';
        iconSpan.title = 'Correct classification';
      } else {
        allCorrect = false;
        pillBtn.classList.remove('is-correct', 'unselected');
        pillBtn.classList.add('is-incorrect');
        iconSpan.innerHTML = ' ✕';
        iconSpan.title = 'Review classification';
      }

      feedbackItems.push({
        name: mutant.name,
        isCorrect: isClassCorrect && isConsequenceCorrect,
        userClass: userSel.class || '(empty)',
        userConsequence: userSel.consequence || '(empty)',
        correctClass: mutant.correctClass,
        correctConsequence: mutant.primaryConsequence,
        explanation: mutant.explanation
      });
    });

    if (allCorrect) {
      playSuccessSound();
      dom.feedbackStatusBadge.className = 'badge-success';
      dom.feedbackStatusBadge.textContent = 'All Correct!';
      dom.feedbackHeadline.textContent = 'Outstanding Molecular Analysis!';
      dom.btnNextCheckpoint.classList.remove('hidden');
      announce('All answers correct! You can proceed to the next checkpoint.');
    } else {
      playIncorrectSound();
      dom.feedbackStatusBadge.className = 'badge-partial';
      dom.feedbackStatusBadge.textContent = 'Needs Review';
      dom.feedbackHeadline.textContent = anyUnanswered ? 'Please Complete Both Answers' : 'Review Your Mutation Predictions';
      dom.btnNextCheckpoint.classList.add('hidden');
      announce('Some answers need review. Check explanations below.');
    }

    // Build feedback explanation cards
    dom.feedbackBody.innerHTML = feedbackItems.map(item => `
      <div class="feedback-item">
        <div class="feedback-item-title">
          <span>${item.isCorrect ? '✅' : '⚠️'}</span>
          <span>${item.name}: Your answer [ ${item.userClass} / ${item.userConsequence} ]</span>
        </div>
        <div class="feedback-explanation">
          ${item.explanation}
        </div>
      </div>
    `).join('');

    dom.feedbackPanel.classList.remove('hidden');
    // Only scroll if feedback panel is off-screen
    const rect = dom.feedbackPanel.getBoundingClientRect();
    if (rect.bottom > window.innerHeight) {
      dom.feedbackPanel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  });

  dom.btnCloseFeedback.addEventListener('click', () => {
    dom.feedbackPanel.classList.add('hidden');
  });

  dom.btnResetAnswers.addEventListener('click', () => {
    playClickSound();
    loadCheckpoint(state.currentCheckpointIndex);
  });

  dom.btnShowSolution.addEventListener('click', () => {
    playClickSound();
    const cp = CHECKPOINTS[state.currentCheckpointIndex];
    cp.mutants.forEach(mutant => {
      state.userSelections[mutant.id] = {
        class: mutant.correctClass,
        consequence: mutant.primaryConsequence
      };
    });
    renderMutantRows(cp);
    dom.btnCheckAnswers.click();
  });

  dom.btnNextCheckpoint.addEventListener('click', () => {
    playClickSound();
    const nextIdx = (state.currentCheckpointIndex + 1) % CHECKPOINTS.length;
    loadCheckpoint(nextIdx);
  });

  // ==========================================================================
  // 9. Base Alignment Inspector Tool
  // ==========================================================================

  dom.btnAlignmentView.addEventListener('click', () => {
    playClickSound();
    dom.alignmentPanel.classList.toggle('hidden');
    if (!dom.alignmentPanel.classList.contains('hidden')) {
      renderAlignmentInspector();
    }
  });

  dom.btnCloseAlignment.addEventListener('click', () => {
    dom.alignmentPanel.classList.add('hidden');
  });

  function renderAlignmentInspector() {
    const cp = CHECKPOINTS[state.currentCheckpointIndex];
    const wtBases = cp.wildType.dna.replace(/-/g, '').split('');

    let html = `
      <div class="alignment-line">
        <span class="align-label">Wild-Type:</span>
        <div class="align-bases">
          ${wtBases.map((b, i) => `<span class="base-cell base-${b}">${b}</span>`).join('')}
        </div>
      </div>
    `;

    cp.mutants.forEach(mut => {
      const mutBases = mut.dna.replace(/-/g, '').split('');
      const maxLen = Math.max(wtBases.length, mutBases.length);
      const cells = [];

      for (let i = 0; i < maxLen; i++) {
        const wtB = wtBases[i] || '-';
        const mutB = mutBases[i] || '-';
        const isDiff = wtB !== mutB;
        cells.push(`
          <span class="base-cell base-${mutB} ${isDiff ? 'base-mutated' : ''}" title="${isDiff ? `Position ${i + 1}: Mutated from ${wtB} to ${mutB}` : `Position ${i + 1}: ${mutB}`}">
            ${mutB}
          </span>
        `);
      }

      html += `
        <div class="alignment-line">
          <span class="align-label">${mut.name}:</span>
          <div class="align-bases">
            ${cells.join('')}
          </div>
        </div>
      `;
    });

    dom.alignmentGrid.innerHTML = html;
  }

  // ==========================================================================
  // 10. Helpers & Toggles
  // ==========================================================================

  dom.btnShowHint.addEventListener('click', () => {
    playClickSound();
    dom.hintBox.classList.toggle('hidden');
  });

  dom.btnToggleMrnaView.addEventListener('click', () => {
    playClickSound();
    state.showMrna = !state.showMrna;
    dom.btnToggleMrnaView.setAttribute('aria-pressed', state.showMrna ? 'true' : 'false');
    dom.mrnaToggleText.textContent = state.showMrna ? 'Hide mRNA' : 'Show mRNA';
    dom.wtMrnaRow.classList.toggle('hidden', !state.showMrna);
  });

  // ==========================================================================
  // 11. Codon Table Modal Logic
  // ==========================================================================

  let codonStrandMode = 'mrna'; // 'mrna' or 'dna'

  function renderCodonCards(filter = 'all', query = '') {
    dom.codonCardsGrid.innerHTML = '';
    const q = query.toLowerCase().trim();

    Object.keys(CODON_TABLE).forEach(mrnaCodon => {
      const data = CODON_TABLE[mrnaCodon];
      const dnaTemplate = mrnaToDnaTemplate(mrnaCodon);

      // Filtering by chemical property
      if (filter !== 'all') {
        if (filter === 'stop' && data.prop !== 'stop') return;
        if (filter !== 'stop' && data.prop !== filter) return;
      }

      // Search matching
      if (q) {
        const matchMrna = mrnaCodon.toLowerCase().includes(q);
        const matchDna = dnaTemplate.toLowerCase().includes(q);
        const matchAa = data.aa.toLowerCase().includes(q);
        const matchName = data.name.toLowerCase().includes(q);
        if (!matchMrna && !matchDna && !matchAa && !matchName) return;
      }

      const displayTriplet = codonStrandMode === 'mrna' ? mrnaCodon : dnaTemplate;

      const card = document.createElement('div');
      card.className = `codon-card prop-${data.prop}`;
      card.innerHTML = `
        <span class="codon-triplet">${displayTriplet}</span>
        <span class="codon-aa-name">${data.aa}</span>
        <span class="codon-full-name" title="${data.name}">${data.name}</span>
      `;
      dom.codonCardsGrid.appendChild(card);
    });
  }

  dom.btnOpenCodon.addEventListener('click', () => {
    playClickSound();
    renderCodonCards();
    dom.modalCodon.showModal();
    dom.btnOpenCodon.setAttribute('aria-expanded', 'true');
  });

  dom.btnCloseCodon.addEventListener('click', () => {
    dom.modalCodon.close();
    dom.btnOpenCodon.setAttribute('aria-expanded', 'false');
  });

  dom.btnDoneCodon.addEventListener('click', () => {
    dom.modalCodon.close();
    dom.btnOpenCodon.setAttribute('aria-expanded', 'false');
  });

  dom.modalCodon.addEventListener('click', (e) => {
    if (e.target === dom.modalCodon) {
      dom.modalCodon.close();
      dom.btnOpenCodon.setAttribute('aria-expanded', 'false');
    }
  });

  dom.codonSearchInput.addEventListener('input', (e) => {
    const activeFilter = dom.codonFilters.querySelector('.filter-chip.active')?.dataset.filter || 'all';
    renderCodonCards(activeFilter, e.target.value);
  });

  dom.codonFilters.addEventListener('click', (e) => {
    if (e.target.classList.contains('filter-chip')) {
      playClickSound();
      dom.codonFilters.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('active'));
      e.target.classList.add('active');
      renderCodonCards(e.target.dataset.filter, dom.codonSearchInput.value);
    }
  });

  dom.btnToggleCodonStrand.addEventListener('click', () => {
    playClickSound();
    codonStrandMode = codonStrandMode === 'mrna' ? 'dna' : 'mrna';
    dom.codonStrandLabel.innerHTML = codonStrandMode === 'mrna' ? "mRNA (5'&rarr;3')" : "Template DNA (3'&rarr;5')";
    const activeFilter = dom.codonFilters.querySelector('.filter-chip.active')?.dataset.filter || 'all';
    renderCodonCards(activeFilter, dom.codonSearchInput.value);
  });

  // ==========================================================================
  // 12. Guide Modal Logic
  // ==========================================================================

  dom.btnOpenGuide.addEventListener('click', () => {
    playClickSound();
    dom.modalGuide.showModal();
    dom.btnOpenGuide.setAttribute('aria-expanded', 'true');
  });

  dom.btnCloseGuide.addEventListener('click', () => {
    dom.modalGuide.close();
    dom.btnOpenGuide.setAttribute('aria-expanded', 'false');
  });

  dom.btnDoneGuide.addEventListener('click', () => {
    dom.modalGuide.close();
    dom.btnOpenGuide.setAttribute('aria-expanded', 'false');
  });

  dom.modalGuide.addEventListener('click', (e) => {
    if (e.target === dom.modalGuide) {
      dom.modalGuide.close();
      dom.btnOpenGuide.setAttribute('aria-expanded', 'false');
    }
  });

  // ==========================================================================
  // 13. Mutation Studio / Sandbox Engine
  // ==========================================================================

  const STUDIO_PRESETS = {
    checkpoint1: 'TAC-TTC-AAA-ATC',
    globin: 'TAC-CAC-GTG-GAC-TGA',
    insulin: 'TAC-AAA-CCC-GGG-ATC',
    custom: 'TAC-TTC-AAA-ATC'
  };

  let studioOriginalDna = 'TAC-TTC-AAA-ATC';
  let studioCurrentDna = 'TAC-TTC-AAA-ATC';

  function renderStudioEditor() {
    dom.studioDnaStrip.innerHTML = '';
    const cleanBases = studioCurrentDna.replace(/-/g, '').split('');

    cleanBases.forEach((base, index) => {
      const btn = document.createElement('button');
      btn.className = `editable-base-btn base-${base}`;
      btn.textContent = base;
      btn.title = `Position ${index + 1}: Click to mutate base`;
      btn.addEventListener('click', () => {
        playClickSound();
        const cycle = { 'A': 'T', 'T': 'C', 'C': 'G', 'G': 'A' };
        cleanBases[index] = cycle[base] || 'A';
        formatAndSetStudioDna(cleanBases.join(''));
      });
      dom.studioDnaStrip.appendChild(btn);
    });

    // Render transcribed mRNA
    const mrna = transcribeDnaTemplate(cleanBases.join(''));
    dom.studioMrnaStrip.innerHTML = mrna.split('').map((b, i) => `
      <span class="mrna-base-badge">${b}</span>
    `).join('');

    // Render translated Peptides
    const peptides = translateMrna(mrna);
    dom.studioPeptideStrip.innerHTML = peptides.map(p => `
      <span class="peptide-badge">${p}</span>
    `).join('<span class="seq-arrow" style="font-size: 0.9rem;">&rarr;</span>');

    // Run classification algorithm
    classifyStudioMutation(cleanBases.join(''), studioOriginalDna.replace(/-/g, ''));
  }

  function formatAndSetStudioDna(rawDna) {
    // Add dashes every 3 bases
    const chunks = [];
    for (let i = 0; i < rawDna.length; i += 3) {
      chunks.push(rawDna.substring(i, i + 3));
    }
    studioCurrentDna = chunks.join('-');
    renderStudioEditor();
  }

  function classifyStudioMutation(mutDna, wtDna) {
    const wtPeptides = translateDnaTemplate(wtDna);
    const mutPeptides = translateDnaTemplate(mutDna);

    if (mutDna === wtDna) {
      dom.studioMutationBadge.className = 'badge-neutral';
      dom.studioMutationBadge.textContent = 'Wild-Type (No Mutations)';
      dom.studioClassVal.textContent = 'None';
      dom.studioConsequenceVal.textContent = 'None';
      dom.studioFrameVal.textContent = 'Normal (In-frame)';
      dom.studioLengthVal.textContent = `${wtPeptides.length} Residues`;
      dom.studioExplanationText.textContent = 'Sequence matches the original wild-type. Click any nucleotide above or choose a mutation button to explore effects.';
      return;
    }

    let mutClass = '';
    let consequence = '';
    let explanation = '';

    const lenDiff = mutDna.length - wtDna.length;

    if (lenDiff === 0) {
      mutClass = 'SNV (Single Nucleotide Variant)';
      let diffCount = 0;
      let diffIdx = -1;
      for (let i = 0; i < mutDna.length; i++) {
        if (mutDna[i] !== wtDna[i]) {
          diffCount++;
          diffIdx = i;
        }
      }

      if (diffCount === 1) {
        const codonIdx = Math.floor(diffIdx / 3);
        const wtAA = wtPeptides[codonIdx];
        const mutAA = mutPeptides[codonIdx];

        if (mutAA === 'Stop' && wtAA !== 'Stop') {
          consequence = 'Nonsense (Premature Stop)';
          explanation = `Single base substitution introduces a premature Stop codon at residue ${codonIdx + 1}, yielding a truncated peptide chain.`;
        } else if (wtAA === mutAA) {
          consequence = 'Silent / Synonymous';
          explanation = `Single base substitution creates a synonymous codon encoding the exact same amino acid (${wtAA}). Protein function is unaffected.`;
        } else {
          consequence = 'Missense';
          explanation = `Single base substitution replaces ${wtAA} with ${mutAA} at position ${codonIdx + 1}.`;
        }
      } else {
        consequence = 'Multiple Substitutions';
        explanation = `${diffCount} base substitutions detected across the sequence.`;
      }
    } else if (lenDiff < 0) {
      mutClass = `Deletion (-${Math.abs(lenDiff)} bp)`;
      if (Math.abs(lenDiff) % 3 === 0) {
        consequence = 'In-frame Deletion';
        explanation = `Deletion of ${Math.abs(lenDiff)} nucleotides (multiple of 3) removes ${Math.abs(lenDiff) / 3} full amino acid(s) without disrupting the downstream reading frame.`;
      } else {
        consequence = 'Frameshift';
        explanation = `Deletion of ${Math.abs(lenDiff)} nucleotide(s) disrupts the triplet reading frame, scrambling all downstream codons!`;
      }
    } else {
      mutClass = `Insertion (+${lenDiff} bp)`;
      if (lenDiff % 3 === 0) {
        consequence = 'In-frame Insertion';
        explanation = `Insertion of ${lenDiff} nucleotides (multiple of 3) inserts ${lenDiff / 3} amino acid(s) in-frame.`;
      } else {
        consequence = 'Frameshift';
        explanation = `Insertion of ${lenDiff} nucleotide(s) shifts the downstream reading frame, altering all subsequent amino acids!`;
      }
    }

    dom.studioMutationBadge.className = 'badge-partial';
    dom.studioMutationBadge.textContent = `${mutClass} &bull; ${consequence}`;
    dom.studioClassVal.textContent = mutClass;
    dom.studioConsequenceVal.textContent = consequence;
    dom.studioFrameVal.textContent = lenDiff % 3 === 0 ? 'Normal (In-frame)' : 'Disrupted (Frameshift)';
    dom.studioLengthVal.textContent = `${mutPeptides.length} Residues`;
    dom.studioExplanationText.innerHTML = explanation;
  }

  dom.studioPresetSelect.addEventListener('change', (e) => {
    playClickSound();
    const key = e.target.value;
    studioOriginalDna = STUDIO_PRESETS[key] || 'TAC-TTC-AAA-ATC';
    studioCurrentDna = studioOriginalDna;
    renderStudioEditor();
  });

  dom.btnStudioReset.addEventListener('click', () => {
    playClickSound();
    studioCurrentDna = studioOriginalDna;
    renderStudioEditor();
  });

  dom.btnStudioSnv.addEventListener('click', () => {
    playClickSound();
    const bases = studioCurrentDna.replace(/-/g, '').split('');
    const randIdx = Math.floor(Math.random() * bases.length);
    const options = ['A', 'T', 'C', 'G'].filter(b => b !== bases[randIdx]);
    bases[randIdx] = options[Math.floor(Math.random() * options.length)];
    formatAndSetStudioDna(bases.join(''));
  });

  dom.btnStudioDel.addEventListener('click', () => {
    playClickSound();
    const bases = studioCurrentDna.replace(/-/g, '').split('');
    if (bases.length > 3) {
      const randIdx = Math.floor(Math.random() * bases.length);
      bases.splice(randIdx, 1);
      formatAndSetStudioDna(bases.join(''));
    }
  });

  dom.btnStudioIns.addEventListener('click', () => {
    playClickSound();
    const bases = studioCurrentDna.replace(/-/g, '').split('');
    if (bases.length < 24) {
      const randIdx = Math.floor(Math.random() * (bases.length + 1));
      const randBase = ['A', 'T', 'C', 'G'][Math.floor(Math.random() * 4)];
      bases.splice(randIdx, 0, randBase);
      formatAndSetStudioDna(bases.join(''));
    }
  });

  // ==========================================================================
  // 14. Speed Drill Mode
  // ==========================================================================

  const DRILL_QUESTION_BANK = [
    {
      wt: 'TAC-TTC-AAA-ATC',
      mut: 'TAC-ATC-AAA-ATC',
      correctClass: 'SNV',
      correctConsequence: 'Nonsense',
      explanation: 'Codon 2 has an SNV (T->A). In template strand ATC transcribes to UAG (Stop), making this a Nonsense mutation.'
    },
    {
      wt: 'TAC-TTC-AAA-ATC',
      mut: 'TAC-TCA-AAA-TC',
      correctClass: 'Deletion',
      correctConsequence: 'Frameshift',
      explanation: 'A single T is deleted from codon 2, altering the reading frame: Deletion and Frameshift.'
    },
    {
      wt: 'TAC-TTC-AAA-ATC',
      mut: 'TAC-TTT-AAA-ATC',
      correctClass: 'SNV',
      correctConsequence: 'Silent',
      explanation: 'TTC to TTT substitution produces mRNA AAA, which still codes for Lysine (Silent).'
    },
    {
      wt: 'TAC-TTC-AAA-ATC',
      mut: 'TAC-TTC-AGA-ATC',
      correctClass: 'SNV',
      correctConsequence: 'Missense',
      explanation: 'Codon 3 substitution changes Phe to Ser: Missense mutation.'
    },
    {
      wt: 'TAC-TTC-AAA-ATC',
      mut: 'TAC-AAA-ATC',
      correctClass: 'Deletion',
      correctConsequence: 'In-frame Indel',
      explanation: '3-nucleotide deletion removes codon TTC without changing downstream frame (In-frame Indel).'
    },
    {
      wt: 'TAC-TTC-AAA-ATC',
      mut: 'TAC-ATT-CAA-AAT-C',
      correctClass: 'Insertion',
      correctConsequence: 'Frameshift',
      explanation: '1-bp insertion disrupts reading frame: Insertion and Frameshift.'
    }
  ];

  let currentDrillIndex = 0;

  function loadDrillQuestion() {
    state.drill.selectedClass = null;
    state.drill.selectedConsequence = null;

    dom.drillFeedbackBox.classList.add('hidden');
    dom.btnDrillSubmit.classList.remove('hidden');
    dom.btnDrillNext.classList.add('hidden');

    // Reset option button highlights
    dom.drillClassOptions.querySelectorAll('.drill-opt-btn').forEach(btn => btn.classList.remove('selected'));
    dom.drillConsequenceOptions.querySelectorAll('.drill-opt-btn').forEach(btn => btn.classList.remove('selected'));

    const q = DRILL_QUESTION_BANK[currentDrillIndex % DRILL_QUESTION_BANK.length];
    state.drill.currentQuestion = q;

    dom.drillWtCode.textContent = q.wt;
    dom.drillWtPeptide.textContent = translateDnaTemplate(q.wt).join('-');
    dom.drillMutCode.textContent = q.mut;
    dom.drillMutPeptide.textContent = translateDnaTemplate(q.mut).join('-');
  }

  dom.drillClassOptions.addEventListener('click', (e) => {
    if (e.target.classList.contains('drill-opt-btn')) {
      playClickSound();
      dom.drillClassOptions.querySelectorAll('.drill-opt-btn').forEach(btn => btn.classList.remove('selected'));
      e.target.classList.add('selected');
      state.drill.selectedClass = e.target.dataset.val;
    }
  });

  dom.drillConsequenceOptions.addEventListener('click', (e) => {
    if (e.target.classList.contains('drill-opt-btn')) {
      playClickSound();
      dom.drillConsequenceOptions.querySelectorAll('.drill-opt-btn').forEach(btn => btn.classList.remove('selected'));
      e.target.classList.add('selected');
      state.drill.selectedConsequence = e.target.dataset.val;
    }
  });

  dom.btnDrillSubmit.addEventListener('click', () => {
    const q = state.drill.currentQuestion;
    if (!state.drill.selectedClass || !state.drill.selectedConsequence) {
      alert('Please select both a Mutation Class and a Functional Consequence!');
      return;
    }

    const isClassCorrect = state.drill.selectedClass === q.correctClass;
    const isConsequenceCorrect = state.drill.selectedConsequence === q.correctConsequence ||
      (q.wt === 'TAC-TTC-AAA-ATC' && q.mut === 'TAC-ATC-AAA-ATC' && state.drill.selectedConsequence === 'Missense');

    if (isClassCorrect && isConsequenceCorrect) {
      playSuccessSound();
      state.drill.score += 10;
      state.drill.streak += 1;
      dom.drillScore.textContent = state.drill.score;
      dom.drillStreak.textContent = `${state.drill.streak} 🔥`;

      dom.drillFeedbackBox.innerHTML = `
        <div style="color: var(--success); font-weight: 700; margin-bottom: 6px;">🎉 Correct! (+10 pts)</div>
        <p>${q.explanation}</p>
      `;
    } else {
      playIncorrectSound();
      state.drill.streak = 0;
      dom.drillStreak.textContent = `0 🔥`;

      dom.drillFeedbackBox.innerHTML = `
        <div style="color: var(--danger); font-weight: 700; margin-bottom: 6px;">✕ Review Answer</div>
        <p>Correct: <strong>${q.correctClass}</strong> and <strong>${q.correctConsequence}</strong>.</p>
        <p style="margin-top: 4px;">${q.explanation}</p>
      `;
    }

    dom.drillFeedbackBox.classList.remove('hidden');
    dom.btnDrillSubmit.classList.add('hidden');
    dom.btnDrillNext.classList.remove('hidden');
  });

  dom.btnDrillNext.addEventListener('click', () => {
    playClickSound();
    currentDrillIndex++;
    loadDrillQuestion();
  });

  // ==========================================================================
  // 15. View Tabs Switching
  // ==========================================================================

  function switchTab(viewId) {
    playClickSound();
    dom.tabCheckpoint.classList.toggle('active', viewId === 'checkpoint');
    dom.tabStudio.classList.toggle('active', viewId === 'studio');
    dom.tabDrill.classList.toggle('active', viewId === 'drill');

    dom.tabCheckpoint.setAttribute('aria-selected', viewId === 'checkpoint');
    dom.tabStudio.setAttribute('aria-selected', viewId === 'studio');
    dom.tabDrill.setAttribute('aria-selected', viewId === 'drill');

    dom.viewCheckpoint.classList.toggle('hidden', viewId !== 'checkpoint');
    dom.viewStudio.classList.toggle('hidden', viewId !== 'studio');
    dom.viewDrill.classList.toggle('hidden', viewId !== 'drill');

    if (viewId === 'studio') {
      renderStudioEditor();
    } else if (viewId === 'drill') {
      loadDrillQuestion();
    }
  }

  dom.tabCheckpoint.addEventListener('click', () => switchTab('checkpoint'));
  dom.tabStudio.addEventListener('click', () => switchTab('studio'));
  dom.tabDrill.addEventListener('click', () => switchTab('drill'));

  // Keyboard navigation between tabs
  const tabButtons = [dom.tabCheckpoint, dom.tabStudio, dom.tabDrill];
  tabButtons.forEach((tab, index) => {
    tab.addEventListener('keydown', (e) => {
      let targetIndex = null;
      if (e.key === 'ArrowRight') {
        targetIndex = (index + 1) % tabButtons.length;
      } else if (e.key === 'ArrowLeft') {
        targetIndex = (index - 1 + tabButtons.length) % tabButtons.length;
      }
      if (targetIndex !== null) {
        tabButtons[targetIndex].focus();
        tabButtons[targetIndex].click();
      }
    });
  });

  // ==========================================================================
  // 16. Theme & Sound Settings
  // ==========================================================================

  function setTheme(theme) {
    state.theme = theme;
    document.documentElement.setAttribute('data-theme', theme);
    if (theme === 'dark') {
      dom.iconSun.classList.add('hidden');
      dom.iconMoon.classList.remove('hidden');
    } else {
      dom.iconSun.classList.remove('hidden');
      dom.iconMoon.classList.add('hidden');
    }
    localStorage.setItem('theme', theme);
  }

  dom.btnToggleTheme.addEventListener('click', () => {
    playClickSound();
    setTheme(state.theme === 'light' ? 'dark' : 'light');
  });

  dom.btnToggleSound.addEventListener('click', () => {
    state.soundEnabled = !state.soundEnabled;
    dom.iconSoundOn.classList.toggle('hidden', !state.soundEnabled);
    dom.iconSoundOff.classList.toggle('hidden', state.soundEnabled);
    if (state.soundEnabled) playClickSound();
  });

  // Initialize theme from storage or system preference
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme) {
    setTheme(savedTheme);
  } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    setTheme('dark');
  } else {
    setTheme('light');
  }

  // ==========================================================================
  // 17. Initialization
  // ==========================================================================

  function init() {
    loadCheckpoint(0);
    renderCodonCards();

    // Support URL parameters for direct linking & testing
    const urlParams = new URLSearchParams(window.location.search);
    const viewParam = urlParams.get('view');
    const levelParam = urlParams.get('level');
    const modalParam = urlParams.get('modal');
    const checkedParam = urlParams.get('checked');
    const themeParam = urlParams.get('theme');

    if (themeParam === 'dark' || themeParam === 'light') {
      setTheme(themeParam);
    }

    if (levelParam && !isNaN(parseInt(levelParam, 10))) {
      const idx = Math.max(0, Math.min(CHECKPOINTS.length - 1, parseInt(levelParam, 10) - 1));
      loadCheckpoint(idx);
    }

    if (viewParam === 'studio') {
      switchTab('studio');
    } else if (viewParam === 'drill') {
      switchTab('drill');
    }

    if (modalParam === 'codon') {
      dom.btnOpenCodon.click();
    } else if (modalParam === 'guide') {
      dom.btnOpenGuide.click();
    }

    if (checkedParam === 'true') {
      dom.btnCheckAnswers.click();
    }
  }

  init();

})();
