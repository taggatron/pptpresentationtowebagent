import * as THREE from './vendor/three.module.js?v=20260823-1';

// The apparatus and the enlarged DNA views share the model's band fractions.
// The latter are diagrams: their colours make stable-isotope ancestry visible.
const COLOUR = { ivory: 0xf0f1e9, dark: 0x183a47, teal: 0x15877f, steel: 0x8ba1aa, heavy: 0x9c76d5, light: 0x48c8b2, band: 0x455884 };
const clamp = value => Math.max(0, Math.min(1, value));
const smooth = value => value * value * (3 - 2 * value);
const phase = (state, step) => state.stage >= step ? 1 : state.stage === step - 1 && state.running ? clamp(state.progress || 0) : 0;
const interval = (p, start, end) => smooth(clamp((p - start) / (end - start)));

// A deterministic sequence keeps previews, replay and reduced-motion stepping
// consistent. Rotor movement finishes before the lid opens or a vial is lifted.
export function meselsonTransferTimeline(progress) {
  const p = clamp(progress), sampleLoad = interval(p, 0, .14), balanceLoad = interval(p, .14, .27);
  const lidOpen = (1 - interval(p, .27, .34) + interval(p, .60, .66)) * (1 - interval(p, .83, .89));
  const capOff = interval(p, .77, .81) * (1 - interval(p, .985, 1));
  const phases = [[.14, 'loading-sample'], [.27, 'loading-balance'], [.34, 'closing-lid'], [.60, 'spinning'], [.66, 'opening-lid'], [.77, 'unloading'], [.81, 'uncapping'], [.93, 'pouring'], [.985, 'returning'], [1, 'recapping']];
  return { phase: p === 0 ? 'ready' : p === 1 ? 'complete' : phases.find(([end]) => p < end)[1], lidOpen,
    sampleLoad, balanceLoad, spinAngle: Math.PI * 24 * interval(p, .34, .60), spinning: p > .34 && p < .60,
    unload: interval(p, .66, .77), pour: interval(p, .81, .93), returning: interval(p, .93, .985),
    capOff, receiverOpen: capOff, reveal: interval(p, .93, 1) };
}
const material = (colour, extra = {}) => new THREE.MeshStandardMaterial({ color: colour, roughness: .43, metalness: .05, ...extra });
const glass = (opacity = .19) => new THREE.MeshPhysicalMaterial({ color: 0xdff6ff, transparent: true, opacity, roughness: .04, metalness: .03, side: THREE.DoubleSide, depthWrite: false, clearcoat: .65 });
function mesh(parent, geometry, mat, x = 0, y = 0, z = 0) {
  const item = new THREE.Mesh(geometry, mat); item.position.set(x, y, z); item.castShadow = !mat.transparent; item.receiveShadow = true; parent.add(item); return item;
}
function box(parent, width, height, depth, mat, x = 0, y = 0, z = 0) {
  return mesh(parent, new THREE.BoxGeometry(width, height, depth), mat, x, y, z);
}
function round(parent, width, height, depth, mat, x = 0, y = 0, z = 0, radius = .045) {
  const r = Math.min(radius, width / 3, height / 3, depth / 3), a = width / 2, b = height / 2, shape = new THREE.Shape();
  shape.moveTo(-a + r, -b); shape.lineTo(a - r, -b); shape.quadraticCurveTo(a, -b, a, -b + r); shape.lineTo(a, b - r); shape.quadraticCurveTo(a, b, a - r, b); shape.lineTo(-a + r, b); shape.quadraticCurveTo(-a, b, -a, b - r); shape.lineTo(-a, -b + r); shape.quadraticCurveTo(-a, -b, -a + r, -b);
  const geometry = new THREE.ExtrudeGeometry(shape, { depth: depth - r * 2, bevelEnabled: true, bevelThickness: r, bevelSize: r, bevelSegments: 3, curveSegments: 5 }); geometry.center();
  return mesh(parent, geometry, mat, x, y, z);
}
function cylinder(parent, radius, height, mat, x = 0, y = 0, z = 0, top = radius) {
  return mesh(parent, new THREE.CylinderGeometry(top, radius, height, 40), mat, x, y, z);
}
function ring(parent, radius, thickness, mat, x, y, z) {
  const item = mesh(parent, new THREE.TorusGeometry(radius, thickness, 10, 56), mat, x, y, z); item.rotation.x = Math.PI / 2; return item;
}
function texture(width, height) {
  const canvas = document.createElement('canvas'); canvas.width = width; canvas.height = height;
  const map = new THREE.CanvasTexture(canvas); map.colorSpace = THREE.SRGBColorSpace;
  return { canvas, context: canvas.getContext('2d'), map };
}
function panel(parent, width, height, x, y, z, pixelWidth = 800, pixelHeight = 360) {
  const surface = texture(pixelWidth, pixelHeight);
  const item = mesh(parent, new THREE.PlaneGeometry(width, height), new THREE.MeshBasicMaterial({ map: surface.map, toneMapped: false, side: THREE.DoubleSide }), x, y, z); item.castShadow = false;
  return { ...surface, item };
}
function label(parent, text, width, height, x, y, z, background = '#f0f1e9', colour = '#183a47') {
  const surface = panel(parent, width, height, x, y, z, Math.max(360, Math.round(width * 360)), Math.max(75, Math.round(height * 360))), c = surface.context;
  c.fillStyle = background; c.fillRect(0, 0, surface.canvas.width, surface.canvas.height); c.fillStyle = colour;
  c.font = `700 ${Math.round(surface.canvas.height * .45)}px system-ui`; c.textAlign = 'center'; c.textBaseline = 'middle';
  c.fillText(text, surface.canvas.width / 2, surface.canvas.height / 2, surface.canvas.width * .94); surface.map.needsUpdate = true;
  return surface;
}
function culture(parent, x, z, isotope, tint) {
  const group = new THREE.Group(); group.position.set(x, .05, z); parent.add(group);
  const profile = [[0, 0], [.30, 0], [.36, .06], [.35, .24], [.13, .68], [.12, .88]].map(([r, y]) => new THREE.Vector2(r, y));
  mesh(group, new THREE.LatheGeometry(profile, 56), glass(.25));
  const fluid = mesh(group, new THREE.LatheGeometry([[0, .04], [.30, .04], [.32, .10], [.26, .35], [0, .35]].map(([r, y]) => new THREE.Vector2(r, y)), 48), material(0xd3dec8, { transparent: true, opacity: .6, depthWrite: false }));
  ring(group, .12, .018, glass(.65), 0, .88, 0);
  cylinder(group, .136, .15, material(tint), 0, .955, 0);
  for (let i = 0; i < 7; i++) box(group, .018, .12, .022, material(tint), Math.sin(i * .85) * .129, .955, Math.cos(i * .85) * .129);
  label(group, `${isotope} MEDIUM`, .48, .19, 0, .33, .296);
  label(group, 'E. coli', .38, .12, 0, .13, .345);
  return { group, fluid };
}
function gradientTube(parent, x, labelText, kind) {
  const group = new THREE.Group(); group.position.set(x, .10, .48); parent.add(group);
  const radius = .175, bottom = .20, height = 1.56;
  mesh(group, new THREE.CylinderGeometry(radius, radius, height, 40, 1, true), glass(.2), 0, bottom + height / 2, 0);
  const end = mesh(group, new THREE.SphereGeometry(radius, 30, 18), glass(.23), 0, bottom, 0); end.scale.y = .55;
  const liquid = new THREE.Group(); liquid.position.y = bottom; group.add(liquid);
  cylinder(liquid, radius * .9, height - .13, material(0xaad6df, { transparent: true, opacity: .28, depthWrite: false }), 0, height / 2 - .03, 0);
  // Gradually darker fluid indicates increasing CsCl density, not sediment.
  const densityLayers = new THREE.Group(); liquid.add(densityLayers);
  for (let i = 0; i < 12; i++) cylinder(densityLayers, radius * .89, .115, material(0x67a3bc, { transparent: true, opacity: .012 + (11 - i) * .009, depthWrite: false }), 0, .07 + i * .117, 0);
  const cap = cylinder(group, .19, .13, material(kind === 'sample' ? COLOUR.teal : COLOUR.dark), 0, 1.80, 0);
  ring(group, .178, .012, material(COLOUR.steel), 0, 1.72, 0);
  for (let i = 0; i < 9; i++) box(group, i % 2 ? .053 : .083, .009, .009, material(0x7191a2), -.033, .35 + i * .15, .176);
  label(group, labelText, .64, .13, 0, .03, .47);
  const bands = Array.from({ length: 3 }, () => {
    const band = cylinder(group, .152, .07, material(COLOUR.band, { transparent: true, opacity: .8, depthWrite: false }), 0, 1, 0);
    band.castShadow = false; band.renderOrder = 2; return band;
  });
  const cloud = cylinder(group, .149, 1.26, material(COLOUR.band, { transparent: true, opacity: .065, depthWrite: false }), 0, .91, 0);
  cloud.castShadow = false;
  return { group, bands, cloud, liquid, densityLayers, cap };
}

function spinVial(parent, name, colour) {
  const group = new THREE.Group(); group.name = `meselson-${name}-vial`; parent.add(group);
  mesh(group, new THREE.CylinderGeometry(.108, .108, .48, 28, 1, true), glass(.38), 0, .30, 0);
  const end = mesh(group, new THREE.SphereGeometry(.108, 24, 14), glass(.38), 0, .065, 0); end.scale.y = .58;
  ring(group, .11, .012, glass(.65), 0, .55, 0);
  const fluid = cylinder(group, .092, .39, material(0x729fb7, { transparent: true, opacity: .7, depthWrite: false }), 0, .265, 0);
  label(group, name === 'sample' ? 'DNA' : 'BAL', .20, .115, 0, .27, .112);
  const cap = new THREE.Group(); cap.name = `meselson-${name}-cap`; parent.add(cap);
  cylinder(cap, .125, .10, material(colour));
  for (let i = 0; i < 14; i++) {
    const angle = i * Math.PI * 2 / 14;
    box(cap, .014, .08, .015, material(colour), Math.sin(angle) * .121, 0, Math.cos(angle) * .121);
  }
  return { group, fluid, cap };
}

function liftBetween(target, from, to, progress, clearance = 2.52) {
  if (progress < .28) target.set(from.x, THREE.MathUtils.lerp(from.y, clearance, interval(progress, 0, .28)), from.z);
  else if (progress < .72) target.set(THREE.MathUtils.lerp(from.x, to.x, interval(progress, .28, .72)), clearance, THREE.MathUtils.lerp(from.z, to.z, interval(progress, .28, .72)));
  else target.set(to.x, THREE.MathUtils.lerp(clearance, to.y, interval(progress, .72, 1)), to.z);
}
function drawStrand(c, x, y, length, colourA, colourB) {
  c.lineCap = 'round';
  for (let i = 0; i <= 14; i++) {
    const px = x + i * length / 14, sway = Math.sin(i / 14 * Math.PI * 3) * 8;
    c.strokeStyle = '#657d91'; c.lineWidth = 2; c.beginPath(); c.moveTo(px, y - 8 + sway); c.lineTo(px, y + 8 - sway); c.stroke();
  }
  for (const [colour, sign] of [[colourA, -1], [colourB, 1]]) {
    c.strokeStyle = colour; c.lineWidth = 6; c.beginPath();
    for (let i = 0; i <= 50; i++) { const px = x + i * length / 50, py = y + sign * (8 - Math.sin(i / 50 * Math.PI * 3) * 8); if (!i) c.moveTo(px, py); else c.lineTo(px, py); } c.stroke();
  }
}


function drawTemplateCopy(c, progress, firstTemplate, secondTemplate, newStrand) {
  const separation = smooth(clamp(progress / .32)), synthesis = smooth(clamp((progress - .27) / .65));
  const left = 60, length = 596, middle = 170, displacement = separation * 26;
  const point = (fraction, row, partner = false) => {
    const wave = Math.sin(fraction * Math.PI * 6) * 7;
    const sign = row === 0 ? -1 : 1;
    return [left + fraction * length, middle + sign * displacement + (partner ? -sign : sign) * (8 - wave)];
  };
  c.lineCap = 'round';
  for (const [row, template] of [[0, firstTemplate], [1, secondTemplate]]) {
    for (let i = 0; i <= 30; i++) {
      const fraction = i / 30;
      if (fraction > synthesis || synthesis <= 0) continue;
      const a = point(fraction, row), b = point(fraction, row, true);
      c.strokeStyle = '#698695'; c.lineWidth = 2; c.beginPath(); c.moveTo(...a); c.lineTo(...b); c.stroke();
    }
    for (const [partner, colour, extent] of [[false, template, 1], [true, newStrand, synthesis]]) {
      if (extent <= 0) continue;
      c.strokeStyle = colour; c.lineWidth = 6; c.beginPath();
      for (let i = 0; i <= 100; i++) { const fraction = i / 100 * extent, p = point(fraction, row, partner); if (!i) c.moveTo(...p); else c.lineTo(...p); } c.stroke();
    }
    if (synthesis > 0 && synthesis < 1) {
      const p = point(synthesis, row, true); c.fillStyle = '#d0ffe7'; c.beginPath(); c.arc(...p, 6, 0, Math.PI * 2); c.fill();
    }
  }
  c.fillStyle = '#a8d3d1'; c.font = '600 24px system-ui';
  c.fillText(synthesis > 0 ? 'COPYING ¹⁴N' : 'SEPARATING', 706, 159);
  c.fillStyle = '#819fae'; c.font = '500 22px system-ui'; c.fillText('templates retained', 706, 195);
}

export function buildMeselsonScene(scene) {
  const parent = scene.root, ivory = material(COLOUR.ivory), dark = material(COLOUR.dark), metal = material(COLOUR.steel, { metalness: .72, roughness: .26 });
  const cultures = new THREE.Group(); cultures.position.set(-1.65, 1.90, -2.72); parent.add(cultures);
  // A shallow wall shelf keeps both cultures visible above the open lid.
  round(cultures, 1.90, .10, .99, dark, 0, -.01, 0);
  for (const x of [-.68, .68]) {
    box(cultures, .075, .47, .065, metal, x, -.30, -.545);
    box(cultures, .075, .065, .83, metal, x, -.095, -.13);
    const brace = box(cultures, .055, .055, .84, metal, x, -.29, -.16); brace.rotation.x = -.51;
    for (const y of [-.47, -.17]) { const screw = cylinder(cultures, .02, .012, dark, x, y, -.506); screw.rotation.x = Math.PI / 2; }
  }
  const heavyCulture = culture(cultures, -.47, 0, '¹⁵N', COLOUR.heavy), lightCulture = culture(cultures, .47, 0, '¹⁴N', COLOUR.light);
  label(cultures, 'LABEL → TRANSFER', 1.77, .13, 0, -.015, .55);
  label(cultures, 'STABLE ISOTOPES', 1.72, .14, 0, 1.21, .08, '#e7ecea');

  const unit = new THREE.Group(); unit.name = 'meselson-ultracentrifuge'; unit.position.set(-1.22, .04, .42); parent.add(unit);
  round(unit, 2.45, 1.14, 1.85, ivory, 0, .69, 0, .10);
  round(unit, 2.46, .13, 1.86, dark, 0, .21, 0, .035);
  // A hollow raised rim lets the balanced rotor sit below the closed lid.
  for (const z of [-.84, .84]) round(unit, 2.45, .28, .17, ivory, 0, 1.39, z, .035);
  for (const x of [-1.14, 1.14]) round(unit, .17, .28, 1.54, ivory, x, 1.39, 0, .035);
  for (const x of [-.97, .97]) for (const z of [-.67, .67]) cylinder(unit, .11, .16, material(0x1f3039), x, .10, z);
  for (let i = 0; i < 6; i++) box(unit, .028, .32, .017, dark, .76 + i * .061, .60, .947);
  cylinder(unit, .77, .07, dark, 0, 1.285, 0);
  cylinder(unit, .69, .045, metal, 0, 1.331, 0);
  const rotor = new THREE.Group(); rotor.position.y = 1.36; unit.add(rotor);
  cylinder(rotor, .64, .11, material(0x304650, { metalness: .8, roughness: .24 }));
  cylinder(rotor, .15, .13, metal, 0, .07, 0);
  for (let i = 0; i < 6; i++) {
    const angle = i * Math.PI / 3, x = Math.cos(angle) * .44, z = Math.sin(angle) * .44;
    cylinder(rotor, .137, .045, material(0x102832), x, .065, z);
  }
  const lid = new THREE.Group(); lid.position.set(0, 1.60, -.80); unit.add(lid);
  round(lid, 2.24, .14, 1.64, ivory, 0, .01, .79, .06);
  round(lid, 2.10, .036, 1.47, dark, 0, -.075, .79, .016);
  round(lid, .65, .07, .16, dark, 0, .11, 1.45, .02);
  for (const x of [-.75, .75]) { const hinge = cylinder(unit, .077, .29, metal, x, 1.60, -.80); hinge.rotation.z = Math.PI / 2; }
  label(unit, 'CsCl DENSITY-GRADIENT ULTRACENTRIFUGE', 2.17, .14, 0, 1.035, .966);
  round(unit, 1.47, .51, .08, dark, -.32, .66, .974, .018);
  const status = panel(unit, 1.37, .43, -.32, .66, 1.021, 760, 236);
  const led = cylinder(unit, .053, .018, material(COLOUR.teal, { emissive: COLOUR.teal, emissiveIntensity: .25 }), .59, .72, .980); led.rotation.x = Math.PI / 2;
  label(unit, 'SEALED · BALANCED', 1.30, .12, -.27, .325, .966);
  scene.connectMains(unit, 'aaq-meselson-ultracentrifuge', [0, .32, -.925], 'left', [[-3.08, .05, -2.49], [-2.82, .05, -1.63], [-1.21, .05, -.92]]);

  const vialTray = new THREE.Group(); vialTray.position.set(-1.22, .04, 1.96); parent.add(vialTray);
  round(vialTray, 1.40, .13, .52, dark, 0, .04, 0);
  for (const x of [-.45, .45]) ring(vialTray, .14, .028, metal, x, .14, 0);
  label(vialTray, 'DNA SAMPLE     /     BALANCE', 1.32, .14, 0, .04, .29);
  const sampleVial = spinVial(parent, 'sample', COLOUR.teal), balanceVial = spinVial(parent, 'balance', COLOUR.steel);
  const sampleHome = new THREE.Vector3(-1.67, .18, 1.96), balanceHome = new THREE.Vector3(-.77, .18, 1.96);
  const sampleSeat = new THREE.Vector3(-.78, .87, .42), balanceSeat = new THREE.Vector3(-1.66, .87, .42);
  const pourTilt = -2.08;
  const pourPosition = new THREE.Vector3(1.56 + Math.sin(pourTilt) * .55, 2.24 - Math.cos(pourTilt) * .55, .87);
  const capPark = new THREE.Vector3(.23, .18, 1.96), capRest = new THREE.Vector3(), lip = new THREE.Vector3(), streamEnd = new THREE.Vector3();
  const stream = cylinder(parent, .026, 1, material(0x85c2d0, { transparent: true, opacity: .7, roughness: .12, depthWrite: false }));
  stream.name = 'meselson-pour-stream'; stream.castShadow = false; stream.visible = false;

  const rack = new THREE.Group(); rack.name = 'meselson-density-gradient-results'; rack.position.set(1.56, 0, .39); parent.add(rack);
  round(rack, 2.22, .14, .83, ivory, 0, .12, .45);
  round(rack, 2.22, .09, .16, ivory, 0, .66, .22);
  for (const x of [-1.025, 1.025]) box(rack, .11, .63, .58, ivory, x, .38, .43);
  const heavyRef = gradientTube(rack, -.73, '¹⁵N CONTROL', 'reference');
  const sample = gradientTube(rack, 0, 'DNA SAMPLE', 'sample');
  const lightRef = gradientTube(rack, .73, '¹⁴N CONTROL', 'reference');
  heavyRef.bands.forEach((band, i) => { band.visible = i === 0; band.position.y = .44; }); heavyRef.cloud.visible = false;
  lightRef.bands.forEach((band, i) => { band.visible = i === 0; band.position.y = 1.53; }); lightRef.cloud.visible = false;
  const densityLabel = label(rack, 'MORE DENSE →', 1.26, .115, 1.125, 1.15, .76, '#f0f1e9');
  densityLabel.item.rotation.z = -Math.PI / 2;
  const resultPlaque = label(parent, 'ENLARGED DNA RESULT', 2.18, .25, 1.56, .035, 1.76);
  resultPlaque.item.rotation.x = -Math.PI / 2;

  const board = new THREE.Group(); board.position.set(1.52, 2.60, -.90); parent.add(board);
  round(board, 2.84, 1.31, .11, dark, 0, 0, 0, .045);
  const ancestry = panel(board, 2.70, 1.18, 0, 0, .065, 1000, 438);
  const stand = box(parent, .09, 1.88, .09, metal, 1.52, .98, -.96); stand.castShadow = false;
  round(parent, .75, .08, .49, dark, 1.52, .045, -.95, .02);

  let lastDisplay = '';
  scene.updates.push((state, time, redraw) => {
    const labelled = phase(state, 1), grown = phase(state, 2), separating = phase(state, 3), read = phase(state, 4);
    const motion = meselsonTransferTimeline(separating);
    lid.rotation.x = state.stage < 2 ? -.52 : -1.22 * motion.lidOpen;
    rotor.rotation.y = motion.spinAngle;
    sampleVial.group.rotation.set(0, 0, 0); balanceVial.group.rotation.set(0, 0, 0);
    liftBetween(sampleVial.group.position, sampleHome, sampleSeat, motion.sampleLoad);
    liftBetween(balanceVial.group.position, balanceHome, balanceSeat, motion.balanceLoad);
    if (motion.spinning) {
      const dx = .44 * Math.cos(motion.spinAngle), dz = -.44 * Math.sin(motion.spinAngle);
      sampleVial.group.position.set(-1.22 + dx, .87, .42 + dz);
      balanceVial.group.position.set(-1.22 - dx, .87, .42 - dz);
    }
    if (motion.unload > 0) liftBetween(sampleVial.group.position, sampleSeat, pourPosition, motion.unload, 2.64);
    const balanceReturn = interval(separating, .69, .81);
    if (balanceReturn > 0) liftBetween(balanceVial.group.position, balanceSeat, balanceHome, balanceReturn);
    sampleVial.group.rotation.z = pourTilt * interval(separating, .795, .81) * (1 - interval(separating, .93, .942));
    if (motion.returning > 0) liftBetween(sampleVial.group.position, pourPosition, sampleHome, motion.returning, 2.64);
    sampleVial.group.updateMatrixWorld(true); balanceVial.group.updateMatrixWorld(true);
    capRest.set(0, .59, 0); sampleVial.group.localToWorld(capRest);
    sampleVial.cap.position.copy(capRest).lerp(capPark, motion.capOff);
    sampleVial.cap.position.y += Math.sin(motion.capOff * Math.PI) * .42;
    sampleVial.cap.rotation.z = sampleVial.group.rotation.z * (1 - motion.capOff);
    capRest.set(0, .59, 0); balanceVial.group.localToWorld(capRest); balanceVial.cap.position.copy(capRest);
    const remaining = 1 - motion.pour;
    sampleVial.fluid.visible = remaining > .001;
    sampleVial.fluid.scale.y = Math.max(.001, remaining); sampleVial.fluid.position.y = .07 + .195 * remaining;
    sample.cap.position.set(.48 * motion.receiverOpen, 1.8 + .52 * motion.receiverOpen, .11 * motion.receiverOpen);
    sample.liquid.visible = motion.pour > .001; sample.liquid.scale.y = Math.max(.001, motion.pour);
    sample.densityLayers.visible = motion.reveal > .05;
    lip.set(0, .55, 0); sampleVial.group.localToWorld(lip);
    streamEnd.set(1.56, .30 + motion.pour * 1.45, .87);
    stream.visible = motion.phase === 'pouring' && motion.capOff > .999 && Math.abs(sampleVial.group.rotation.z) > 1.5;
    if (stream.visible) {
      const direction = streamEnd.clone().sub(lip);
      stream.position.copy(lip).add(streamEnd).multiplyScalar(.5);
      stream.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction.clone().normalize());
      stream.scale.set(1, direction.length(), 1);
    }
    parent.userData.meselsonMotion = { phase: motion.phase, lidOpen: -lid.rotation.x / 1.22, spinning: motion.spinning,
      sampleCapOpen: motion.capOff, receiverCapOpen: motion.receiverOpen, streamVisible: stream.visible,
      streamStart: lip.toArray(), streamEnd: streamEnd.toArray(), samplePosition: sampleVial.group.position.toArray(),
      balancePosition: balanceVial.group.position.toArray(), sampleTilt: sampleVial.group.rotation.z, receiverFill: motion.pour };
    heavyCulture.fluid.material.color.setHex(labelled > .3 ? 0xc9bddf : 0xd3dec8);
    lightCulture.fluid.material.color.lerpColors(new THREE.Color(0xd3dec8), new THREE.Color(0xb3d7cf), grown);
    led.material.emissiveIntensity = motion.spinning ? .6 + Math.sin(time * 4) * .14 : .2;
    const output = state.output || {}, observed = output.predictions?.semiconservative || [];
    // Pouring cannot preserve a real CsCl gradient. Fade to an enlarged UV
    // result diagram only after the illustrative transfer has finished.
    sample.cloud.visible = false;
    sample.bands.forEach((band, index) => {
      const data = observed[index]; band.visible = Boolean(data && data.fraction > 0 && motion.reveal > 0);
      if (!data) return;
      band.position.y = 1.53 - clamp(data.density) * 1.09;
      band.scale.y = .35 + Math.max(0, data.fraction) * 1.2;
      band.material.opacity = motion.reveal * .9;
    });
    const signature = `${state.stage}:${state.running}:${state.parameter}:${motion.phase}:${Math.floor(separating * 120)}:${Math.floor(grown * 120)}:${Math.floor(read * 10)}`;
    if (!redraw || signature === lastDisplay) return; lastDisplay = signature;
    const c = status.context, w = status.canvas.width, h = status.canvas.height;
    c.fillStyle = '#0b2830'; c.fillRect(0, 0, w, h); c.textAlign = 'left';
    c.fillStyle = '#9bcbc9'; c.font = '600 27px system-ui'; c.fillText('ISOPYCNIC SEPARATION', 26, 45);
    c.fillStyle = '#8be5c5'; c.font = '700 36px system-ui';
    const messages = { ready: grown >= 1 ? 'DNA + BALANCE READY' : 'PREPARE DNA + CsCl', 'loading-sample': 'LOADING DNA SAMPLE', 'loading-balance': 'LOADING MATCHED BALANCE', 'closing-lid': 'CLOSING & LOCKING LID', spinning: 'LID LOCKED · SPINNING', 'opening-lid': 'STOPPED · OPENING LID', unloading: 'LIFTING OUT THE VIALS', uncapping: 'OPENING SAMPLE & RECEIVER', pouring: 'ILLUSTRATIVE TRANSFER', returning: 'ENLARGED UV BAND PROFILE', recapping: 'REPLACING CAPS', complete: 'DNA RESULT READY' };
    c.fillText(messages[motion.phase], 26, 103, w - 50);
    c.fillStyle = '#bed9da'; c.font = '500 25px system-ui'; c.fillText(separating >= .81 ? 'Real bands are read in the original spin tube.' : 'Sealed tubes · matched opposing loads', 26, 155, w - 50);
    c.fillStyle = '#24444b'; c.fillRect(26, 187, w - 52, 13); c.fillStyle = '#54cbb4'; c.fillRect(26, 187, (w - 52) * separating, 13);
    status.map.needsUpdate = true;

    const a = ancestry.context, aw = ancestry.canvas.width, ah = ancestry.canvas.height;
    a.fillStyle = '#102d37'; a.fillRect(0, 0, aw, ah); a.textAlign = 'left';
    a.fillStyle = '#a8d3d1'; a.font = '600 27px system-ui'; a.fillText('SEMICONSERVATIVE REPLICATION', 35, 43);
    const generation = Number.isFinite(output.generation) ? output.generation : Math.round(Number(state.parameter) || 0);
    const copying = state.stage === 1 && state.running && generation > 0 && grown < 1;
    const elapsedGenerations = grown * generation, copyGeneration = Math.min(generation, Math.floor(elapsedGenerations) + 1);
    const copyProgress = elapsedGenerations - Math.floor(elapsedGenerations);
    const shownGeneration = grown >= 1 ? generation : 0;
    a.fillStyle = '#ffffff'; a.font = '700 40px system-ui'; a.fillText(copying ? `Copying generation ${copyGeneration} of ${generation}` : shownGeneration === 0 ? 'Parental DNA' : `After ${shownGeneration} generation${shownGeneration === 1 ? '' : 's'}`, 35, 103);
    const heavy = '#b496eb', light = '#5fd9ba';
    const molecules = shownGeneration === 0 ? [[heavy, heavy], [heavy, heavy]] : shownGeneration === 1 ? [[heavy, light], [heavy, light]] : shownGeneration === 2 ? [[heavy, light], [heavy, light], [light, light], [light, light]] : Array.from({ length: shownGeneration >= 4 ? 8 : 4 }, (_, i) => i === 0 ? [heavy, light] : [light, light]);
    if (copying) drawTemplateCopy(a, copyProgress, heavy, copyGeneration === 1 ? heavy : light, light);
    else molecules.forEach(([colourA, colourB], i) => drawStrand(a, 60 + (i % 4) * 225, molecules.length > 4 ? 151 + Math.floor(i / 4) * 49 : 173, 155, colourA, colourB));
    a.font = '500 26px system-ui'; a.fillStyle = '#c1d5da';
    a.fillText(copying ? 'One molecule shown: both templates gain a new ¹⁴N partner.' : shownGeneration > 2 ? 'Molecule proportions shown; original strands are conserved.' : shownGeneration === 0 ? 'Both strands carry the original heavy nitrogen label.' : 'Each daughter molecule keeps one template strand.', 35, 233, aw - 70);
    a.fillStyle = heavy; a.fillRect(35, 271, 43, 9); a.fillStyle = '#d9e7ee'; a.fillText('Original ¹⁵N strand', 95, 285);
    a.fillStyle = light; a.fillRect(520, 271, 43, 9); a.fillStyle = '#d9e7ee'; a.fillText('New ¹⁴N strand', 580, 285);
    a.strokeStyle = '#31505b'; a.beginPath(); a.moveTo(35, 313); a.lineTo(965, 313); a.stroke();
    a.fillStyle = '#8de0c5'; a.font = '600 29px system-ui';
    const fractions = [output.heavyFraction, output.hybridFraction, output.lightFraction];
    a.fillText(separating >= 1 && fractions.every(Number.isFinite) ? `${Number((fractions[0] * 100).toFixed(1))}% heavy     ${Number((fractions[1] * 100).toFixed(1))}% hybrid     ${Number((fractions[2] * 100).toFixed(1))}% light` : 'Run the density gradient to reveal the DNA bands.', 35, 361, aw - 70);
    a.fillStyle = '#96b5bf'; a.font = '500 23px system-ui'; a.fillText('¹⁵N and ¹⁴N are stable isotopes. Colours are explanatory.', 35, 407, aw - 70);
    ancestry.map.needsUpdate = true;
  });
}
