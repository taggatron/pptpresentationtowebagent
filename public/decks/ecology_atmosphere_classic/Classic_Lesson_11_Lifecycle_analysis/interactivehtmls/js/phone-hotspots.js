/**
 * Interactive Phone Hotspots & Pin Callouts for iPhone Multi-Generation Explorer.
 * Handles model-specific SVG interactive meshes, pulsating radar pins, audio synthesizer clicks,
 * and laser leader lines to inspector cards.
 */

const MODEL_HOTSPOT_BOUNDS = {
  xs:      { front: [244, 270.5, 398.5, 573.5], back: [430, 270.5, 584, 573.5], cx_back: 507, cy_back: 422 },
  '11pro': { front: [255.5, 270, 405.5, 573.5], back: [450, 277.5, 572.5, 573.5], cx_back: 511, cy_back: 425.5 },
  '12pro': { front: [297.5, 277, 410, 573], back: [420.5, 277, 530, 572.5], cx_back: 475, cy_back: 424.5 },
  '13pro': { front: [266.5, 271, 413.5, 573.5], back: [436, 273, 562, 573.5], cx_back: 499, cy_back: 423 },
  '14pro': { front: [276, 273.5, 418.5, 573.5], back: [432.5, 277, 553.5, 573.5], cx_back: 493, cy_back: 425 },
  '15pro': { front: [293.5, 277.5, 412.5, 570.5], back: [423, 277.5, 534, 572], cx_back: 478.5, cy_back: 424.5 },
  '16pro': { front: [289, 276.5, 405, 573.5], back: [422.5, 276.5, 538.5, 573.5], cx_back: 480.5, cy_back: 425 },
  '17pro': { front: [290.5, 276, 407.5, 573.5], back: [420.5, 276.5, 537.5, 573.5], cx_back: 479, cy_back: 425 },
  '18pro': { front: [291.5, 275.5, 405, 571], back: [423, 275.5, 536.5, 571], cx_back: 479.5, cy_back: 423 }
};

class PhoneHotspots {
  constructor(options = {}) {
    this.container = options.container || document.getElementById("phone-hotspots-group");
    this.leaderLineGroup = options.leaderLineGroup || document.getElementById("leader-line-group");
    this.tooltipEl = document.getElementById("phone-part-tooltip");
    this.onSelect = options.onSelect || (() => {});
    this.onHover = options.onHover || (() => {});
    this.audioEnabled = false;
    this.audioCtx = null;
    this.activeComponentId = null;
    this.currentModelId = options.modelId || (typeof currentModelId !== "undefined" ? currentModelId : "xs");

    // Sound is off by default.
    this.render();
  }

  initAudio() {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        this.audioCtx = new AudioContext();
      }
    } catch (e) {
      console.warn("Web Audio not supported", e);
    }
  }

  playClickSound(freq = 520, duration = 0.04) {
    if (!this.audioEnabled || !this.audioCtx) return;
    try {
      if (this.audioCtx.state === "suspended") {
        this.audioCtx.resume();
      }
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, this.audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(freq * 0.5, this.audioCtx.currentTime + duration);

      gain.gain.setValueAtTime(0.08, this.audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + duration);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc.start();
      osc.stop(this.audioCtx.currentTime + duration);
    } catch (e) {
      // Audio playback failed silently
    }
  }

  render() {
    this.renderHotspotMesh(this.currentModelId);
  }

  getComponentPin(componentId, modelId = this.currentModelId || "xs") {
    const b = MODEL_HOTSPOT_BOUNDS[modelId] || MODEL_HOTSPOT_BOUNDS.xs;
    const fx0 = b.front[0], fy0 = b.front[1], fx1 = b.front[2], fy1 = b.front[3];
    const bx0 = b.back[0], by0 = b.back[1], bx1 = b.back[2], by1 = b.back[3];
    const bw = bx1 - bx0;
    const bh = by1 - by0;
    const fh = fy1 - fy0;

    switch (componentId) {
      case "display":
        return { x: Math.round((fx0 + fx1) / 2), y: Math.round(fy0 + fh * 0.40) };
      case "stainless_steel":
        return { x: Math.round(bx1 - 4), y: Math.round((by0 + by1) / 2) };
      case "glass":
        return { x: Math.round((bx0 + bx1) / 2), y: Math.round(by0 + bh * 0.20) };
      case "circuit_boards":
        if (modelId === "xs") return { x: Math.round(bx0 + bw * 0.73), y: Math.round(by0 + bh * 0.41) };
        if (modelId === "18pro") return { x: Math.round(bx0 + bw * 0.50), y: Math.round(by0 + bh * 0.37) };
        return { x: Math.round(bx0 + bw * 0.73), y: Math.round(by0 + bh * 0.35) };
      case "battery":
        if (modelId === "xs") return { x: Math.round(bx0 + bw * 0.31), y: Math.round(by0 + bh * 0.36) };
        if (modelId === "11pro") return { x: Math.round(bx0 + bw * 0.44), y: Math.round(by0 + bh * 0.70) };
        if (modelId === "13pro") return { x: Math.round(bx0 + bw * 0.31), y: Math.round(by0 + bh * 0.57) };
        if (modelId === "17pro") return { x: Math.round(bx0 + bw * 0.48), y: Math.round(by0 + bh * 0.75) };
        if (modelId === "18pro") return { x: Math.round(bx0 + bw * 0.50), y: Math.round(by0 + bh * 0.56) };
        return { x: Math.round(bx0 + bw * 0.30), y: Math.round(by0 + bh * 0.54) };
      case "other":
        if (modelId === "xs") return { x: Math.round(bx0 + bw * 0.46), y: Math.round(by0 + bh * 0.68) };
        if (modelId === "11pro") return { x: Math.round(bx0 + bw * 0.355), y: Math.round(by0 + bh * 0.47) };
        if (modelId === "18pro") return { x: Math.round(bx0 + bw * 0.50), y: Math.round(by0 + bh * 0.75) };
        return { x: Math.round(bx0 + bw * 0.50), y: Math.round(by0 + bh * 0.495) };
      case "plastics":
        return { x: Math.round(bx0 + bw * 0.73), y: Math.round(by0 + bh * 0.87) };
      case "aluminum":
        if (modelId === "xs" || modelId === "11pro") return { x: Math.round(bx0 + bw * 0.31), y: Math.round(by0 + bh * 0.09) };
        if (modelId === "17pro") return { x: Math.round(bx0 + bw * 0.32), y: Math.round(by0 + bh * 0.46) };
        if (modelId === "18pro") return { x: Math.round(bx0 + bw * 0.69), y: Math.round(by0 + bh * 0.15) };
        return { x: Math.round(bx0 + bw * 0.50), y: Math.round(by0 + bh * 0.08) };
      default:
        return { x: Math.round((bx0 + bx1) / 2), y: Math.round((by0 + by1) / 2) };
    }
  }

  renderHotspotMesh(modelId = this.currentModelId || "xs") {
    if (!this.container) return;
    this.currentModelId = modelId;

    const b = MODEL_HOTSPOT_BOUNDS[modelId] || MODEL_HOTSPOT_BOUNDS.xs;
    const fx0 = b.front[0], fy0 = b.front[1], fx1 = b.front[2], fy1 = b.front[3];
    const bx0 = b.back[0], by0 = b.back[1], bx1 = b.back[2], by1 = b.back[3];

    const fw = fx1 - fx0;
    const fh = fy1 - fy0;
    const bw = bx1 - bx0;
    const bh = by1 - by0;

    let hotspots = [
      {
        id: "display",
        title: "Super Retina Display",
        type: "rect",
        x: fx0 + 6,
        y: fy0 + 8,
        width: fw - 12,
        height: fh - 16,
        rx: 16,
        ry: 16
      },
      {
        id: "stainless_steel",
        title: "Precision Chassis & Frame",
        type: "multi-path",
        paths: [
          `M ${fx0},${fy0 + 16} C ${fx0},${fy0 + 4} ${fx0 + 6},${fy0} ${fx0 + 16},${fy0} L ${fx0 + 20},${fy0 + 4} C ${fx0 + 10},${fy0 + 4} ${fx0 + 6},${fy0 + 10} ${fx0 + 6},${fy0 + 18} L ${fx0 + 6},${fy1 - 18} C ${fx0 + 6},${fy1 - 10} ${fx0 + 10},${fy1 - 4} ${fx0 + 20},${fy1 - 4} L ${fx0 + 16},${fy1} C ${fx0 + 6},${fy1} ${fx0},${fy1 - 4} ${fx0},${fy1 - 16} Z`,
          `M ${bx1 - 16},${by0} C ${bx1 - 6},${by0} ${bx1},${by0 + 4} ${bx1},${by0 + 16} L ${bx1},${by1 - 16} C ${bx1},${by1 - 4} ${bx1 - 6},${by1} ${bx1 - 16},${by1} L ${bx1 - 20},${by1 - 4} C ${bx1 - 10},${by1 - 4} ${bx1 - 6},${by1 - 10} ${bx1 - 6},${by1 - 18} L ${bx1 - 6},${by0 + 18} C ${bx1 - 6},${by0 + 10} ${bx1 - 10},${by0 + 4} ${bx1 - 20},${by0 + 4} Z`
        ]
      },
      {
        id: "glass",
        title: "Precision Back Glass",
        type: "rect",
        x: bx0 + 6,
        y: by0 + 6,
        width: bw - 12,
        height: bh - 12,
        rx: 18,
        ry: 18
      }
    ];

    if (modelId === "xs") {
      hotspots.push({
        id: "circuit_boards",
        title: "Logic Board & Dual Camera",
        type: "multi-path",
        paths: [
          `M ${bx0 + Math.round(bw * 0.58)},${by0 + Math.round(bh * 0.04)} h ${Math.round(bw * 0.32)} v ${Math.round(bh * 0.18)} h ${-Math.round(bw * 0.32)} Z`,
          `M ${bx0 + Math.round(bw * 0.54)},${by0 + Math.round(bh * 0.22)} h ${Math.round(bw * 0.37)} v ${Math.round(bh * 0.38)} h ${-Math.round(bw * 0.37)} Z`
        ]
      });
      hotspots.push({
        id: "battery",
        title: "Lithium-Ion Battery Pack",
        type: "rect",
        x: bx0 + Math.round(bw * 0.08),
        y: by0 + Math.round(bh * 0.14),
        width: Math.round(bw * 0.46),
        height: Math.round(bh * 0.44),
        rx: 10,
        ry: 10
      });
      hotspots.push({
        id: "other",
        title: "Wireless Qi Charging Coil & Taptic",
        type: "multi-path",
        paths: [
          `M ${bx0 + Math.round(bw * 0.17)},${by0 + Math.round(bh * 0.58)} h ${Math.round(bw * 0.58)} v ${Math.round(bh * 0.20)} h ${-Math.round(bw * 0.58)} Z`,
          `M ${bx0 + Math.round(bw * 0.12)},${by0 + Math.round(bh * 0.81)} h ${Math.round(bw * 0.40)} v ${Math.round(bh * 0.08)} h ${-Math.round(bw * 0.40)} Z`
        ]
      });
      hotspots.push({
        id: "aluminum",
        title: "Internal Thermal Shielding",
        type: "rect",
        x: bx0 + Math.round(bw * 0.08),
        y: by0 + Math.round(bh * 0.04),
        width: Math.round(bw * 0.47),
        height: Math.round(bh * 0.10),
        rx: 8,
        ry: 8
      });
    } else if (modelId === "18pro") {
      hotspots.push({
        id: "circuit_boards",
        title: "Integrated Camera & Central A20 SoC",
        type: "multi-path",
        paths: [
          `M ${bx0 + Math.round(bw * 0.08)},${by0 + Math.round(bh * 0.04)} h ${Math.round(bw * 0.40)} v ${Math.round(bh * 0.22)} h ${-Math.round(bw * 0.40)} Z`,
          `M ${bx0 + Math.round(bw * 0.10)},${by0 + Math.round(bh * 0.26)} h ${Math.round(bw * 0.80)} v ${Math.round(bh * 0.22)} h ${-Math.round(bw * 0.80)} Z`
        ]
      });
      hotspots.push({
        id: "battery",
        title: "Solid-State High-Density Cell Pack",
        type: "rect",
        x: bx0 + Math.round(bw * 0.10),
        y: by0 + Math.round(bh * 0.48),
        width: Math.round(bw * 0.80),
        height: Math.round(bh * 0.17),
        rx: 10,
        ry: 10
      });
      const coilCx = Math.round(bx0 + bw * 0.50);
      const coilCy = Math.round(by0 + bh * 0.75);
      const coilR = Math.round(bw * 0.26);
      hotspots.push({
        id: "other",
        title: "MagSafe Coil & Taptic Subsystems",
        type: "multi-path",
        paths: [
          `M ${coilCx - coilR},${coilCy} a ${coilR},${coilR} 0 1,0 ${coilR * 2},0 a ${coilR},${coilR} 0 1,0 ${-coilR * 2},0`,
          `M ${bx0 + Math.round(bw * 0.12)},${by0 + Math.round(bh * 0.85)} h ${Math.round(bw * 0.40)} v ${Math.round(bh * 0.08)} h ${-Math.round(bw * 0.40)} Z`
        ]
      });
      hotspots.push({
        id: "aluminum",
        title: "Graphene Thermal Dissipator Plate",
        type: "rect",
        x: bx0 + Math.round(bw * 0.48),
        y: by0 + Math.round(bh * 0.04),
        width: Math.round(bw * 0.42),
        height: Math.round(bh * 0.22),
        rx: 8,
        ry: 8
      });
    } else {
      // 11pro through 17pro
      // Circuit boards: Camera top left + Logic board on right
      hotspots.push({
        id: "circuit_boards",
        title: "Camera Module & Logic Board",
        type: "multi-path",
        paths: [
          `M ${bx0 + Math.round(bw * 0.08)},${by0 + Math.round(bh * 0.04)} h ${Math.round(bw * 0.44)} v ${Math.round(bh * 0.23)} h ${-Math.round(bw * 0.44)} Z`,
          `M ${bx0 + Math.round(bw * 0.54)},${by0 + Math.round(bh * 0.04)} h ${Math.round(bw * 0.37)} v ${Math.round(bh * 0.62)} h ${-Math.round(bw * 0.37)} Z`
        ]
      });

      // Aluminum midframe / chassis bracket (rendered beneath focal battery/coil)
      hotspots.push({
        id: "aluminum",
        title: modelId === "17pro" ? "Copper Vapor Chamber Sheet" : "Internal Thermal Shielding",
        type: "rect",
        x: modelId === "17pro" ? Math.round(bx0 + bw * 0.10) : Math.round(bx0 + bw * 0.08),
        y: modelId === "17pro" ? Math.round(by0 + bh * 0.28) : Math.round(by0 + bh * 0.04),
        width: modelId === "17pro" ? Math.round(bw * 0.44) : (modelId === "11pro" ? Math.round(bw * 0.46) : Math.round(bw * 0.84)),
        height: modelId === "17pro" ? Math.round(bh * 0.37) : (modelId === "11pro" ? Math.round(bh * 0.10) : Math.round(bh * 0.08)),
        rx: 6,
        ry: 6
      });

      if (modelId === "11pro") {
        hotspots.push({
          id: "battery",
          title: "Lithium-Ion L-Shaped Battery Pack",
          type: "multi-path",
          paths: [
            `M ${bx0 + Math.round(bw * 0.08)},${by0 + Math.round(bh * 0.26)} h ${Math.round(bw * 0.42)} v ${Math.round(bh * 0.08)} h ${-Math.round(bw * 0.42)} Z`,
            `M ${bx0 + Math.round(bw * 0.08)},${by0 + Math.round(bh * 0.26)} h ${Math.round(bw * 0.12)} v ${Math.round(bh * 0.34)} h ${-Math.round(bw * 0.12)} Z`,
            `M ${bx0 + Math.round(bw * 0.08)},${by0 + Math.round(bh * 0.60)} h ${Math.round(bw * 0.72)} v ${Math.round(bh * 0.21)} h ${-Math.round(bw * 0.72)} Z`
          ]
        });
        const coilCx = Math.round(bx0 + bw * 0.355);
        const coilCy = Math.round(by0 + bh * 0.47);
        const coilRx = Math.round(bw * 0.185);
        const coilRy = Math.round(bh * 0.13);
        hotspots.push({
          id: "other",
          title: "Taptic & Magnets",
          type: "multi-path",
          paths: [
            `M ${coilCx - coilRx},${coilCy} a ${coilRx},${coilRy} 0 1,0 ${coilRx * 2},0 a ${coilRx},${coilRy} 0 1,0 ${-coilRx * 2},0`,
            `M ${bx0 + Math.round(bw * 0.12)},${by0 + Math.round(bh * 0.81)} h ${Math.round(bw * 0.40)} v ${Math.round(bh * 0.08)} h ${-Math.round(bw * 0.40)} Z`
          ]
        });
      } else if (modelId === "13pro") {
        hotspots.push({
          id: "battery",
          title: "Lithium-Ion L-Shaped Battery Pack",
          type: "multi-path",
          paths: [
            `M ${bx0 + Math.round(bw * 0.08)},${by0 + Math.round(bh * 0.28)} h ${Math.round(bw * 0.44)} v ${Math.round(bh * 0.58)} h ${-Math.round(bw * 0.44)} Z`,
            `M ${bx0 + Math.round(bw * 0.52)},${by0 + Math.round(bh * 0.68)} h ${Math.round(bw * 0.32)} v ${Math.round(bh * 0.18)} h ${-Math.round(bw * 0.32)} Z`
          ]
        });
        const coilCx = Math.round(bx0 + bw * 0.50);
        const coilCy = Math.round(by0 + bh * 0.495);
        const coilR = Math.round(bw * 0.34);
        hotspots.push({
          id: "other",
          title: "MagSafe Array & Taptic Engine",
          type: "multi-path",
          paths: [
            `M ${coilCx - coilR},${coilCy} a ${coilR},${coilR} 0 1,0 ${coilR * 2},0 a ${coilR},${coilR} 0 1,0 ${-coilR * 2},0`,
            `M ${bx0 + Math.round(bw * 0.45)},${by0 + Math.round(bh * 0.68)} h ${Math.round(bw * 0.10)} v ${Math.round(bh * 0.12)} h ${-Math.round(bw * 0.10)} Z`,
            `M ${bx0 + Math.round(bw * 0.12)},${by0 + Math.round(bh * 0.86)} h ${Math.round(bw * 0.40)} v ${Math.round(bh * 0.08)} h ${-Math.round(bw * 0.40)} Z`
          ]
        });
      } else if (modelId === "17pro") {
        hotspots.push({
          id: "battery",
          title: "Next-Gen L-Shaped Battery Cell",
          type: "rect",
          x: bx0 + Math.round(bw * 0.08),
          y: by0 + Math.round(bh * 0.66),
          width: Math.round(bw * 0.80),
          height: Math.round(bh * 0.18),
          rx: 10,
          ry: 10
        });
        const coilCx = Math.round(bx0 + bw * 0.50);
        const coilCy = Math.round(by0 + bh * 0.495);
        const coilR = Math.round(bw * 0.34);
        hotspots.push({
          id: "other",
          title: "MagSafe Array & Taptic Subsystems",
          type: "multi-path",
          paths: [
            `M ${coilCx - coilR},${coilCy} a ${coilR},${coilR} 0 1,0 ${coilR * 2},0 a ${coilR},${coilR} 0 1,0 ${-coilR * 2},0`,
            `M ${bx0 + Math.round(bw * 0.45)},${by0 + Math.round(bh * 0.68)} h ${Math.round(bw * 0.10)} v ${Math.round(bh * 0.12)} h ${-Math.round(bw * 0.10)} Z`,
            `M ${bx0 + Math.round(bw * 0.12)},${by0 + Math.round(bh * 0.85)} h ${Math.round(bw * 0.40)} v ${Math.round(bh * 0.08)} h ${-Math.round(bw * 0.40)} Z`
          ]
        });
      } else {
        // 12pro, 14pro, 15pro, 16pro
        hotspots.push({
          id: "battery",
          title: modelId === "16pro" ? "Laser-Welded Steel Thermal Battery" : "Lithium-Ion Battery Pack",
          type: "rect",
          x: bx0 + Math.round(bw * 0.08),
          y: by0 + Math.round(bh * 0.28),
          width: Math.round(bw * 0.44),
          height: Math.round(bh * 0.53),
          rx: 10,
          ry: 10
        });
        const coilCx = Math.round(bx0 + bw * 0.50);
        const coilCy = Math.round(by0 + bh * 0.495);
        const coilR = Math.round(bw * 0.34);
        hotspots.push({
          id: "other",
          title: "MagSafe Array & Taptic Engine",
          type: "multi-path",
          paths: [
            `M ${coilCx - coilR},${coilCy} a ${coilR},${coilR} 0 1,0 ${coilR * 2},0 a ${coilR},${coilR} 0 1,0 ${-coilR * 2},0`,
            `M ${bx0 + Math.round(bw * 0.45)},${by0 + Math.round(bh * 0.68)} h ${Math.round(bw * 0.10)} v ${Math.round(bh * 0.12)} h ${-Math.round(bw * 0.10)} Z`,
            `M ${bx0 + Math.round(bw * 0.12)},${by0 + Math.round(bh * (modelId === "16pro" ? 0.83 : 0.81))} h ${Math.round(bw * 0.40)} v ${Math.round(bh * 0.08)} h ${-Math.round(bw * 0.40)} Z`
          ]
        });
      }
    }

    const sy0 = modelId === "13pro" ? 0.86 : modelId === "16pro" ? 0.83 : (modelId === "17pro" || modelId === "18pro") ? 0.85 : 0.81;
    hotspots.push({
      id: "plastics",
      title: "Acoustic Speaker & Plastics",
      type: "multi-path",
      paths: [
        `M ${bx0 + Math.round(bw * 0.58)},${by0 + Math.round(bh * sy0)} h ${Math.round(bw * 0.30)} v ${Math.round(bh * 0.13)} h ${-Math.round(bw * 0.30)} Z`,
        `M ${bx0 + Math.round(bw * 0.10)},${by0 + Math.round(bh * 0.91)} h ${Math.round(bw * 0.80)} v ${Math.round(bh * 0.06)} h ${-Math.round(bw * 0.80)} Z`
      ]
    });

    let html = "";
    hotspots.forEach((h) => {
      if (h.type === "path") {
        html += `
          <path id="hotspot-mesh-${h.id}"
                class="phone-mesh-part"
                d="${h.d}"
                fill="#ffffff"
                fill-opacity="0.001"
                stroke="none"
                pointer-events="all"
                data-id="${h.id}"
                data-title="${h.title}">
            <title>${h.title}</title>
          </path>
        `;
      } else if (h.type === "rect") {
        html += `
          <rect id="hotspot-mesh-${h.id}"
                class="phone-mesh-part"
                x="${h.x}"
                y="${h.y}"
                width="${h.width}"
                height="${h.height}"
                rx="${h.rx || 0}"
                ry="${h.ry || 0}"
                fill="#ffffff"
                fill-opacity="0.001"
                stroke="none"
                pointer-events="all"
                data-id="${h.id}"
                data-title="${h.title}">
            <title>${h.title}</title>
          </rect>
        `;
      } else if (h.type === "multi-path") {
        html += `<g id="hotspot-mesh-${h.id}" class="phone-mesh-part" data-id="${h.id}" data-title="${h.title}" pointer-events="all">`;
        h.paths.forEach((p) => {
          html += `<path d="${p}" fill="#ffffff" fill-opacity="0.001" stroke="none" pointer-events="all"></path>`;
        });
        html += `<title>${h.title}</title></g>`;
      } else if (h.type === "circle") {
        html += `
          <circle id="hotspot-mesh-${h.id}"
                class="phone-mesh-part"
                cx="${h.cx}"
                cy="${h.cy}"
                r="${h.r}"
                fill="#ffffff"
                fill-opacity="0.001"
                stroke="none"
                pointer-events="all"
                data-id="${h.id}"
                data-title="${h.title}">
            <title>${h.title}</title>
          </circle>
        `;
      }
    });

    this.container.innerHTML = html;

    // Attach click and hover handlers to mesh components
    hotspots.forEach((h) => {
      const el = document.getElementById(`hotspot-mesh-${h.id}`);
      if (el) {
        el.addEventListener("click", (e) => {
          e.stopPropagation();
          this.playClickSound(640);
          const newTarget = this.activeComponentId === h.id ? null : h.id;
          this.onSelect(newTarget);
        });

        el.addEventListener("mouseenter", (e) => {
          this.playClickSound(800, 0.02);
          this.highlightHover(h.id, true, e, true);
        });

        el.addEventListener("mousemove", (e) => {
          this.highlightHover(h.id, true, e, false);
        });

        el.addEventListener("mouseleave", () => {
          this.highlightHover(h.id, false, null, true);
        });
      }
    });
  }

  highlightHover(componentId, isHovered, event = null, triggerCallback = false) {
    const meshEl = document.getElementById(`hotspot-mesh-${componentId}`);
    if (meshEl) {
      if (isHovered) {
        meshEl.classList.add("mesh-hovered");
      } else {
        meshEl.classList.remove("mesh-hovered");
      }
    }

    if (this.tooltipEl) {
      if (isHovered && componentId && event) {
        const comp = ENVIRONMENTAL_DATA.components ? ENVIRONMENTAL_DATA.components[componentId] : null;
        if (comp) {
          this.tooltipEl.innerHTML = `
            <span class="tooltip-dot" style="background: ${comp.materialColor};"></span>
            <strong>${comp.name}</strong> • ${comp.weightFormatted} (${comp.weightPercentage}%)
          `;
          this.tooltipEl.classList.add("visible");
          const stageRect = document.getElementById("interactive-stage").getBoundingClientRect();
          const x = event.clientX - stageRect.left + 14;
          const y = event.clientY - stageRect.top + 14;
          this.tooltipEl.style.left = `${x}px`;
          this.tooltipEl.style.top = `${y}px`;
        }
      } else {
        this.tooltipEl.classList.remove("visible");
      }
    }

    // Cross-highlight other subsystems
    if (triggerCallback && this.onHover) {
      this.onHover(componentId, isHovered);
    }
  }

  update(componentId) {
    this.activeComponentId = componentId;

    // Update mesh classes
    document.querySelectorAll(".phone-mesh-part").forEach((el) => {
      const id = el.getAttribute("data-id");
      if (componentId && id === componentId) {
        el.classList.add("mesh-active");
      } else {
        el.classList.remove("mesh-active");
      }
    });

    this.renderLeaderLine(componentId);
  }

  renderLeaderLine(componentId) {
    if (!this.leaderLineGroup) return;

    if (!componentId) {
      this.leaderLineGroup.innerHTML = "";
      return;
    }

    const comp = ENVIRONMENTAL_DATA.components ? ENVIRONMENTAL_DATA.components[componentId] : null;
    if (!comp) {
      this.leaderLineGroup.innerHTML = "";
      return;
    }

    const pin = this.getComponentPin(componentId, this.currentModelId);
    const startX = pin.x;
    const startY = pin.y;

    // Target the left border of the top-right card at (547, targetY)
    const targetX = 547;
    // Map vertical component position smoothly to card left edge (range ~65 to 175)
    const targetY = Math.round(Math.min(175, Math.max(65, 80 + (startY - 280) * 0.32)));

    // Route cleanly out through the corridor between phone and right elements (x >= 496)
    const cp1x = Math.max(Math.round(startX + (targetX - startX) * 0.4), 496);
    const cp1y = Math.round(startY - (startY - targetY) * 0.12);
    const cp2x = 522;
    const cp2y = Math.round(targetY + (startY - targetY) * 0.22);

    const pathD = `M ${startX} ${startY} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${targetX} ${targetY}`;

    this.leaderLineGroup.innerHTML = `
      <g class="leader-line-animated" filter="url(#glow-effect)">
        <!-- Underlying soft glow aura -->
        <path d="${pathD}"
              stroke="${comp.materialColor}"
              stroke-width="4"
              stroke-opacity="0.35"
              fill="none"
              stroke-linecap="round"></path>

        <!-- Dynamic Laser Dash line -->
        <path class="laser-flow-line"
              d="${pathD}"
              stroke="${comp.materialColor}"
              stroke-width="2.2"
              fill="none"
              stroke-linecap="round"></path>

        <!-- Origin component ping & dot -->
        <circle cx="${startX}" cy="${startY}" r="7" fill="${comp.materialColor}" fill-opacity="0.25" class="laser-origin-ping"></circle>
        <circle cx="${startX}" cy="${startY}" r="3.5" fill="#ffffff" stroke="${comp.materialColor}" stroke-width="2"></circle>

        <!-- Target card anchor node -->
        <circle cx="${targetX}" cy="${targetY}" r="4" fill="${comp.materialColor}" stroke="#ffffff" stroke-width="1.5"></circle>
      </g>
    `;
  }
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = PhoneHotspots;
}
