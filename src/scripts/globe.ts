/**
 * 3D billboard globe — ported from the design's "Stella Ads 3D Hero.html"
 * (docs/reference/stella-3d-hero.html). Behaviour and look unchanged; libraries
 * bundled from npm, data read from the page instead of being hard-coded.
 */
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { geoPath, geoGraticule, geoEquirectangular, type GeoProjection } from 'd3-geo';
import { feature, mesh } from 'topojson-client';
import type { Topology, GeometryCollection } from 'topojson-specification';

interface GBoard { slug: string; name: string; city: string; lat: number; lon: number; traffic: string; price: string; availability: string; available: boolean; photo: string; photoAlt: string }
interface GCity { name: string; lat: number; lon: number }
interface GView { id: string; label: string; lat: number; lon: number; d: number }

const C = { ocean: '#0f1211', grid: '#18201c', land: '#232a26', border: '#38413c', sa: '#0B3D2E', saEdge: '#17D97A', avail: '#17D97A', occ: '#8a8d8b' };

export async function initGlobe(root: HTMLElement) {
  const q = <T extends Element = HTMLElement>(sel: string) => root.querySelector<T>(sel) as T;
  const data = JSON.parse(q('[data-globe-data]').textContent || '{}') as { boards: GBoard[]; cities: GCity[]; views: GView[] };
  const BOARDS = data.boards, CITIES = data.cities, VIEWS = data.views;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

  const ll = (lat: number, lon: number, r = 1) => {
    const p = (90 - lat) * Math.PI / 180, t = (lon + 180) * Math.PI / 180;
    return new THREE.Vector3(-r * Math.sin(p) * Math.cos(t), r * Math.cos(p), r * Math.sin(p) * Math.sin(t));
  };
  const easeIO = (t: number) => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  const easeBack = (t: number) => { const c1 = 1.5, c3 = c1 + 1; return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2); };
  const bounce = (t: number) => { const n = 7.5625, d = 2.75; if (t < 1 / d) return n * t * t; if (t < 2 / d) return n * (t -= 1.5 / d) * t + 0.75; if (t < 2.5 / d) return n * (t -= 2.25 / d) * t + 0.9375; return n * (t -= 2.625 / d) * t + 0.984375; };

  const stage = q('[data-stage]');
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  stage.appendChild(renderer.domElement);
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(35, 1, 0.0005, 50);
  const controls = new OrbitControls(camera, renderer.domElement);
  Object.assign(controls, { enableDamping: true, dampingFactor: 0.08, enablePan: false, minDistance: 1.025, maxDistance: 4.5, zoomSpeed: 0.9 });

  const globe = new THREE.Group();
  globe.scale.setScalar(0.001);
  scene.add(globe);
  const sphereMat = new THREE.MeshBasicMaterial({ color: C.land });
  const sphere = new THREE.Mesh(new THREE.SphereGeometry(1, 128, 96), sphereMat);
  globe.add(sphere);
  const rim = new THREE.Mesh(new THREE.RingGeometry(1.0, 1.012, 128), new THREE.MeshBasicMaterial({ color: '#1f3a2e', side: THREE.DoubleSide }));
  scene.add(rim);

  type Topo = Topology<{ countries: GeometryCollection }>;
  function draw(ctx: CanvasRenderingContext2D, proj: GeoProjection, w: number, h: number, topo: Topo, lw: { grid: number; g: number; b: number; s: number }) {
    const path = geoPath(proj, ctx);
    ctx.fillStyle = C.ocean; ctx.fillRect(0, 0, w, h);
    ctx.beginPath(); path(geoGraticule().step([lw.grid, lw.grid])()); ctx.strokeStyle = C.grid; ctx.lineWidth = lw.g; ctx.stroke();
    const feats = (feature(topo, topo.objects.countries) as unknown as GeoJSON.FeatureCollection).features;
    const sa = feats.find((f) => f.id === '710');
    ctx.beginPath(); feats.forEach((f) => { if (f !== sa) path(f); }); ctx.fillStyle = C.land; ctx.fill();
    ctx.beginPath(); path(mesh(topo, topo.objects.countries, (a, b) => a !== b)); ctx.strokeStyle = C.border; ctx.lineWidth = lw.b; ctx.stroke();
    if (sa) { ctx.beginPath(); path(sa); ctx.fillStyle = C.sa; ctx.fill(); ctx.strokeStyle = C.saEdge; ctx.lineWidth = lw.s; ctx.stroke(); }
  }
  function tex(canvas: HTMLCanvasElement) {
    const t = new THREE.CanvasTexture(canvas);
    t.colorSpace = THREE.SRGBColorSpace;
    t.anisotropy = renderer.capabilities.getMaxAnisotropy();
    return t;
  }
  async function buildEarth() {
    const topo = (await import('world-atlas/countries-110m.json')).default as unknown as Topo;
    const W = 4096, H = 2048, cv = document.createElement('canvas'); cv.width = W; cv.height = H;
    draw(cv.getContext('2d')!, geoEquirectangular().scale(W / (2 * Math.PI)).translate([W / 2, H / 2]), W, H, topo, { grid: 15, g: 1.5, b: 1.5, s: 2.5 });
    sphereMat.map = tex(cv); sphereMat.color.set('#ffffff'); sphereMat.needsUpdate = true;
    // high-res patch over southern Africa so the zoomed-in view stays crisp
    const L0 = 14, L1 = 36, T0 = -20, T1 = -37, rad = Math.PI / 180;
    const pw = 3072, s = pw / ((L1 - L0) * rad), ph = Math.round(s * (T0 - T1) * rad);
    const pc = document.createElement('canvas'); pc.width = pw; pc.height = ph;
    draw(pc.getContext('2d')!, geoEquirectangular().scale(s).translate([-s * L0 * rad, s * T0 * rad]), pw, ph, topo, { grid: 1, g: 1, b: 2, s: 2 });
    const patch = new THREE.Mesh(
      new THREE.SphereGeometry(1.0004, 96, 72, (L0 + 180) * rad, (L1 - L0) * rad, (90 - T0) * rad, (T0 - T1) * rad),
      new THREE.MeshBasicMaterial({ map: tex(pc) }),
    );
    globe.add(patch);
  }

  // Marker: round head with a soft halo, white outline and centre dot, on a slim stem with a ground dot.
  function pinTex(fill: string, core: string, edge = '#ffffff') {
    const c = document.createElement('canvas'); c.width = 256; c.height = 320; const x = c.getContext('2d')!;
    x.scale(2, 2); const TAU = Math.PI * 2;
    x.beginPath(); x.ellipse(64, 152, 13, 5, 0, 0, TAU); x.fillStyle = 'rgba(0,0,0,0.35)'; x.fill();
    x.beginPath(); x.arc(64, 151, 4, 0, TAU); x.fillStyle = edge; x.fill();
    x.beginPath(); x.moveTo(64, 82); x.lineTo(64, 150); x.lineWidth = 3.5; x.lineCap = 'round'; x.strokeStyle = edge; x.stroke();
    x.beginPath(); x.arc(64, 52, 46, 0, TAU); x.globalAlpha = 0.2; x.fillStyle = fill; x.fill(); x.globalAlpha = 1;
    x.beginPath(); x.arc(64, 52, 30, 0, TAU); x.fillStyle = fill; x.fill(); x.lineWidth = 6; x.strokeStyle = edge; x.stroke();
    x.beginPath(); x.arc(64, 52, 9, 0, TAU); x.fillStyle = core; x.fill();
    const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = renderer.capabilities.getMaxAnisotropy(); return t;
  }
  const spriteMat = (fill: string, core: string, edge?: string) => new THREE.SpriteMaterial({ map: pinTex(fill, core, edge), depthTest: true, depthWrite: false, transparent: true });
  const baseGeo = new THREE.CircleGeometry(0.55, 32); baseGeo.rotateX(-Math.PI / 2);
  const mats = {
    avail: spriteMat(C.avail, '#0e0f0f'),
    occ: spriteMat('#6b6f6d', '#ffffff'),
    sel: spriteMat('#0e0f0f', '#17D97A', '#17D97A'),
    base: new THREE.MeshBasicMaterial({ color: '#000000', transparent: true, opacity: 0.25, depthWrite: false }),
  };
  const UP = new THREE.Vector3(0, 1, 0);
  interface Pin { b: GBoard; n: THREE.Vector3; g: THREE.Group; head: THREE.Sprite; base: THREE.Mesh; drop: { t0: number; dur: number } | null; lift: number }
  const pins: Pin[] = [], hitTargets: THREE.Sprite[] = [];
  BOARDS.forEach((b, i) => {
    const n = ll(b.lat, b.lon);
    const g = new THREE.Group();
    g.position.copy(n).multiplyScalar(1.0006);
    g.quaternion.setFromUnitVectors(UP, n);
    const base = new THREE.Mesh(baseGeo, mats.base); base.position.y = 0.02; base.visible = false;
    g.add(base);
    globe.add(g);
    const head = new THREE.Sprite(b.available ? mats.avail : mats.occ);
    head.center.set(0.5, 0); head.visible = false; head.userData.index = i; head.renderOrder = 2;
    scene.add(head);
    pins.push({ b, n, g, head, base, drop: null, lift: 1 });
    hitTargets.push(head);
  });

  const labelsEl = q('[data-labels]');
  const cityEls = CITIES.map((c) => { const d = document.createElement('div'); d.className = 'city'; d.textContent = c.name; labelsEl.appendChild(d); return { ...c, v: ll(c.lat, c.lon, 1.001), el: d }; });
  const tip = q('[data-tip]');

  let W = 1, H = 1;
  const off = { x: 0, y: 0 }, offT = { x: 0, y: 0 };
  let panelOpen = false;
  function computeOffset() {
    const mobile = W < 760;
    if (panelOpen) Object.assign(offT, mobile ? { x: 0, y: H * 0.3 } : { x: Math.min(210, W * 0.22), y: 0 });
    else Object.assign(offT, mobile ? { x: 0, y: -H * 0.17 } : { x: -W * 0.2, y: 0 });
  }
  function resize() {
    W = stage.clientWidth || innerWidth; H = stage.clientHeight || innerHeight;
    renderer.setSize(W, H);
    camera.aspect = W / H;
    computeOffset(); off.x = offT.x; off.y = offT.y;
    camera.setViewOffset(W, H, off.x, off.y, W, H);
  }
  addEventListener('resize', resize);
  resize();

  interface Fly { fromDir: THREE.Vector3; q: THREE.Quaternion; fromD: number; toD: number; bump: number; t0: number; dur: number; done?: () => void }
  let fly: Fly | null = null;
  function flyTo(dir: THREE.Vector3, d: number, dur = 1700, done?: () => void) {
    const from = camera.position.clone();
    const fromDir = from.clone().normalize(), toDir = dir.clone().normalize();
    const ang = fromDir.angleTo(toDir);
    if (reduced) dur = 1;
    fly = { fromDir, q: new THREE.Quaternion().setFromUnitVectors(fromDir, toDir), fromD: from.length(), toD: d, bump: Math.min(1.2, ang * 0.9), t0: performance.now(), dur, done };
    controls.enabled = false;
  }
  const qI = new THREE.Quaternion(), qT = new THREE.Quaternion();
  function stepFly(now: number) {
    const f = fly!;
    const k = Math.min(1, (now - f.t0) / f.dur), e = easeIO(k);
    qT.copy(qI).slerp(f.q, e);
    const dir = f.fromDir.clone().applyQuaternion(qT);
    const d = f.fromD + (f.toD - f.fromD) * e + Math.sin(Math.PI * e) * f.bump * (f.fromD > 1.6 || f.toD > 1.6 ? 0.25 : 1);
    camera.position.copy(dir.multiplyScalar(d));
    camera.lookAt(0, 0, 0);
    if (k >= 1) { const cb = f.done; fly = null; controls.enabled = true; controls.update(); cb && cb(); }
  }

  // View chips are server-rendered buttons; JS just wires them up.
  const chipBtns = Array.from(root.querySelectorAll<HTMLButtonElement>('[data-view]'));
  let activeView: string | null = 'gauteng';
  function renderChips() {
    chipBtns.forEach((b) => { const on = b.dataset.view === activeView; b.classList.toggle('on', on); b.setAttribute('aria-pressed', String(on)); });
  }
  function goView(id: string, dur?: number) { const v = VIEWS.find((x) => x.id === id)!; activeView = id; renderChips(); flyTo(ll(v.lat, v.lon), v.d, dur); }
  chipBtns.forEach((b) => b.addEventListener('click', () => { closePanel(false); cancelIntro(); goView(b.dataset.view!); }));

  const panel = q('[data-panel]'), copy = q('[data-copy]'), dock = q('[data-dock]');
  const P = <T extends HTMLElement = HTMLElement>(k: string) => panel.querySelector<T>(`[data-p="${k}"]`)!;
  let selected = -1, returnTo: { pos: THREE.Vector3 } | null = null, lastFocus: Element | null = null;
  function openPin(i: number) {
    const p = pins[i]; if (!p) return;
    if (selected < 0) { returnTo = { pos: camera.position.clone() }; lastFocus = document.activeElement; }
    if (selected >= 0) pins[selected].head.material = pins[selected].b.available ? mats.avail : mats.occ;
    selected = i; p.head.material = mats.sel;
    const b = p.b;
    P('name').textContent = b.name; P('city').textContent = b.city + ', South Africa';
    P('status').textContent = b.availability; P('dot').className = 'dot' + (b.available ? '' : ' off');
    P('traffic').textContent = b.traffic; P('price').textContent = b.price;
    P('gps').textContent = b.lat.toFixed(4) + ', ' + b.lon.toFixed(4);
    const ph = P<HTMLImageElement>('photo');
    if (b.photo) { ph.src = b.photo; ph.alt = b.photoAlt || 'Drone photo of ' + b.name; ph.hidden = false; P('photoEmpty').style.display = 'none'; }
    else { ph.removeAttribute('src'); ph.alt = ''; ph.hidden = true; P('photoEmpty').style.display = ''; }
    const quote = P<HTMLAnchorElement>('quote');
    quote.textContent = b.available ? 'Request a quote' : 'Join the waitlist';
    quote.dataset.enquire = b.name;
    panelOpen = true; computeOffset();
    panel.classList.add('open'); dock.classList.add('shift'); panel.setAttribute('aria-hidden', 'false'); panel.inert = false; copy.classList.add('hide');
    activeView = null; renderChips();
    flyTo(p.n, 1.035, 1500);
  }
  function closePanel(back = true) {
    if (selected < 0) return;
    pins[selected].head.material = pins[selected].b.available ? mats.avail : mats.occ;
    selected = -1; panelOpen = false; computeOffset();
    panel.classList.remove('open'); dock.classList.remove('shift'); panel.setAttribute('aria-hidden', 'true'); panel.inert = true; copy.classList.remove('hide');
    if (back && returnTo) flyTo(returnTo.pos, returnTo.pos.length(), 1300);
    returnTo = null;
    if (lastFocus instanceof HTMLElement && panel.contains(document.activeElement)) lastFocus.focus();
  }
  P('close').onclick = () => closePanel();
  P('next').onclick = () => openPin((selected + 1) % pins.length);
  P('prev').onclick = () => openPin((selected - 1 + pins.length) % pins.length);
  addEventListener('keydown', (e) => { if (e.key === 'Escape') closePanel(); });

  const ray = new THREE.Raycaster(), ptr = new THREE.Vector2();
  let downAt: { x: number; y: number } | null = null, hoverIdx = -1;
  function pick(cx: number, cy: number) {
    const r = renderer.domElement.getBoundingClientRect();
    ptr.set(((cx - r.left) / r.width) * 2 - 1, -((cy - r.top) / r.height) * 2 + 1);
    ray.setFromCamera(ptr, camera);
    const hits = ray.intersectObjects(hitTargets.filter((h) => h.visible), false);
    if (!hits.length) return -1;
    const g = ray.intersectObject(sphere, false)[0];
    if (g && g.distance < hits[0].distance - 0.0005 && camera.position.length() > 1.2) return -1;
    return hits[0].object.userData.index as number;
  }
  let introTimers: number[] = [];
  const cancelIntro = () => { introTimers.forEach(clearTimeout); introTimers = []; };
  renderer.domElement.addEventListener('pointerdown', (e) => {
    downAt = { x: e.clientX, y: e.clientY };
    stage.classList.add('dragging');
    if (fly && !fly.done) { fly = null; controls.enabled = true; controls.update(); }
    cancelIntro();
  });
  addEventListener('pointerup', (e) => {
    stage.classList.remove('dragging');
    if (!downAt) return;
    const moved = Math.hypot(e.clientX - downAt.x, e.clientY - downAt.y); downAt = null;
    if (moved > 6) { if (activeView) { activeView = null; renderChips(); } return; }
    const i = pick(e.clientX, e.clientY);
    if (i >= 0) openPin(i);
  });
  renderer.domElement.addEventListener('pointermove', (e) => {
    if (downAt) return;
    hoverIdx = pick(e.clientX, e.clientY);
    stage.classList.toggle('hovering', hoverIdx >= 0);
  });
  renderer.domElement.addEventListener('pointerleave', () => { hoverIdx = -1; stage.classList.remove('hovering'); });
  renderer.domElement.addEventListener('wheel', () => { cancelIntro(); if (activeView) { activeView = null; renderChips(); } }, { passive: true });

  const intro = { t0: 0, popDur: reduced ? 1 : 1100 };
  function dropPins(delay = 0) {
    pins.forEach((p, k) => { p.drop = { t0: performance.now() + delay + (reduced ? 0 : k * 110), dur: reduced ? 1 : 900 }; });
  }
  function startIntro() {
    intro.t0 = performance.now();
    camera.position.copy(ll(8, -10).multiplyScalar(4.2));
    camera.lookAt(0, 0, 0);
    if (reduced) { globe.scale.setScalar(1); dropPins(); goView('gauteng', 1); return; }
    introTimers.push(window.setTimeout(() => flyTo(ll(-29, 25.5), 2.3, 1900), 350));
    introTimers.push(window.setTimeout(() => dropPins(), 2050));
    introTimers.push(window.setTimeout(() => goView('gauteng', 2100), 3500));
    activeView = 'gauteng'; renderChips();
  }

  // Pause rendering while the hero is off-screen (saves battery on phones).
  let visible = true;
  new IntersectionObserver(([e]) => { const was = visible; visible = e.isIntersecting; if (visible && !was) requestAnimationFrame(frame); }).observe(root);

  const v3 = new THREE.Vector3(), camDir = new THREE.Vector3();
  function project(v: THREE.Vector3) { v3.copy(v).project(camera); return { x: (v3.x * 0.5 + 0.5) * W, y: (-v3.y * 0.5 + 0.5) * H, z: v3.z }; }
  function frame(now: number) {
    if (!visible) return;
    requestAnimationFrame(frame);
    const pk = Math.min(1, (now - intro.t0) / intro.popDur);
    globe.scale.setScalar(Math.max(0.001, easeBack(pk)));
    rim.scale.copy(globe.scale);
    if (fly) stepFly(now); else controls.update();
    const d = camera.position.length();
    controls.rotateSpeed = Math.min(0.6, Math.max(0.025, (d - 1) * 0.45));
    off.x += (offT.x - off.x) * 0.08; off.y += (offT.y - off.y) * 0.08;
    camera.setViewOffset(W, H, off.x, off.y, W, H);
    rim.quaternion.copy(camera.quaternion);
    rim.visible = d > 1.4;

    const s = Math.max(0.00022, (d - 1) * 0.0092);
    camDir.copy(camera.position).normalize();
    const camUp = new THREE.Vector3(0, 1, 0).applyQuaternion(camera.quaternion);
    const gs = globe.scale.x;
    pins.forEach((p, i) => {
      const k2 = i === selected ? 1.3 : i === hoverIdx ? 1.15 : 1;
      p.g.scale.setScalar(s * k2);
      if (p.drop) {
        const k = Math.min(1, Math.max(0, (now - p.drop.t0) / p.drop.dur));
        p.lift = 1 - bounce(k);
        p.head.visible = now >= p.drop.t0;
        p.base.visible = k > 0.4;
      }
      const sz = s * 3.6 * k2;
      p.head.scale.set(sz * 0.8, sz, 1);
      p.head.position.copy(p.n).multiplyScalar(1.0006 * gs).addScaledVector(camUp, p.lift * s * 22);
    });

    const showCities = d < 1.6;
    cityEls.forEach((c) => {
      const facing = c.v.clone().normalize().dot(camDir) > 0.2;
      const pt = project(c.v);
      const on = showCities && facing && pt.z < 1;
      c.el.style.opacity = on ? '1' : '0';
      if (on) { c.el.style.left = pt.x + 'px'; c.el.style.top = (pt.y + 18) + 'px'; }
    });
    if (hoverIdx >= 0 && hoverIdx !== selected) {
      const p = pins[hoverIdx], w = p.head.position.clone().addScaledVector(camUp, p.head.scale.y);
      const pt = project(w);
      tip.textContent = p.b.name; tip.style.left = pt.x + 'px'; tip.style.top = (pt.y + 4) + 'px'; tip.classList.add('show');
    } else tip.classList.remove('show');

    renderer.render(scene, camera);
  }

  try { await buildEarth(); } catch (err) { console.warn('Map data failed to load', err); }
  q('[data-loader]').style.opacity = '0';
  root.classList.add('globe-ready');
  startIntro();
  requestAnimationFrame(frame);
}
