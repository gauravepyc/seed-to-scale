/**
 * 3D book for Webflow.
 *
 * Put a canvas with data-book inside the featured stage.
 * Three.js must be loaded first (see README).
 *
 * Attributes on [data-book]:
 *   data-book-variant="harness|frontier|teams"
 *   data-book-distance="4.2"
 *   data-book-rest="0,-0.42,0"
 *   data-book-interactive="false"   — cover only, no click
 *   data-book-hint                   — optional, on a sibling label
 *
 * API:
 *   window.site.books.get(canvas).open()
 *   window.site.books.get(canvas).close()
 *   window.site.books.get(canvas).setPage(n)
 */

import {
  ACESFilmicToneMapping,
  AmbientLight,
  Clock,
  DirectionalLight,
  Group,
  HemisphereLight,
  MathUtils,
  Mesh,
  PCFSoftShadowMap,
  PerspectiveCamera,
  PlaneGeometry,
  Raycaster,
  SRGBColorSpace,
  Scene,
  ShadowMaterial,
  Vector2,
  WebGLRenderer,
} from "three";
import { createBook } from "../src/components/Book3D/createBook.js";
import { CONFIG } from "../src/components/Book3D/config.js";

const COVERS = {
  harness: "cover",
  frontier: "cover-frontier",
  teams: "cover-teams",
};

const TILT_PITCH = 18;
const TILT_YAW = 24;
const TILT_ROLL = 10;
const TILT_FOLLOW = 7;
const TILT_RETURN = 4.5;

function onReady(callback) {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", callback);
  } else {
    callback();
  }
}

function parseRest(value) {
  const parts = String(value || "0,0,0")
    .split(",")
    .map((n) => Number(n.trim()));
  return [parts[0] || 0, parts[1] || 0, parts[2] || 0];
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function mountBook(canvas) {
  const wrap =
    canvas.closest("[data-featured-book]") || canvas.parentElement;
  if (!wrap) return null;

  const variant = canvas.getAttribute("data-book-variant") || "harness";
  const interactive = canvas.getAttribute("data-book-interactive") !== "false";
  const cameraDistance = Number(canvas.getAttribute("data-book-distance") || 4.2);
  const tiltStrength = Number(canvas.getAttribute("data-book-tilt") || 0.45);
  const [restX, restY, restZ] = parseRest(canvas.getAttribute("data-book-rest") || "0,-0.42,0");
  const cover = COVERS[variant] ?? "cover";
  const hint = wrap.querySelector("[data-book-hint]");

  const renderer = new WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true,
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, interactive ? 3 : 2));
  renderer.shadowMap.enabled = interactive;
  renderer.shadowMap.type = PCFSoftShadowMap;
  renderer.outputColorSpace = SRGBColorSpace;
  renderer.toneMapping = ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.42;
  renderer.setClearColor(0x000000, 0);

  const scene = new Scene();
  const camera = new PerspectiveCamera(42, 1, 0.1, 50);
  camera.position.set(0, 0, cameraDistance);
  camera.lookAt(0, 0, 0);

  scene.add(new AmbientLight(0xfff6ec, 0.82));
  scene.add(new HemisphereLight(0xfff8f2, 0xc4b6a4, 0.95));

  const key = new DirectionalLight(0xfff8f2, interactive ? 1.45 : 1.62);
  key.position.set(2.6, 3.8, 3.4);
  key.castShadow = interactive;
  key.shadow.mapSize.set(1024, 1024);
  key.shadow.radius = 8;
  key.shadow.bias = -0.0015;
  key.shadow.normalBias = 0.035;
  key.shadow.camera.near = 1;
  key.shadow.camera.far = 14;
  key.shadow.camera.left = -3.2;
  key.shadow.camera.right = 3.2;
  key.shadow.camera.top = 3.2;
  key.shadow.camera.bottom = -3.2;
  const shadowIntensity = 0.12;
  const hasShadowIntensity = typeof key.shadow.intensity === "number";
  if (hasShadowIntensity) key.shadow.intensity = shadowIntensity;
  scene.add(key);

  const fill = new DirectionalLight(0xfff4e8, 0.78);
  fill.position.set(-3.4, 1.6, 2.6);
  scene.add(fill);

  const bounce = new DirectionalLight(0xfff8f2, 0.58);
  bounce.position.set(-1.1, 2.4, 3.2);
  scene.add(bounce);

  const rim = new DirectionalLight(0xefe9e1, 0.58);
  rim.position.set(-1.4, 2.6, -3.6);
  scene.add(rim);

  const pages = CONFIG.variants?.[variant]?.pages;
  const content = pages ? { ...CONFIG, pages } : CONFIG;
  const book = createBook(cover, content);
  const maxAniso = renderer.capabilities.getMaxAnisotropy();
  book.meshes.forEach((mesh) => {
    mesh.castShadow = interactive;
    const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
    mats.forEach((mat) => {
      if (mat.map) mat.map.anisotropy = maxAniso;
    });
  });

  const tiltGroup = new Group();
  const pivot = new Group();
  pivot.rotation.set(restX, restY, restZ);
  pivot.add(book.group);
  tiltGroup.add(pivot);
  scene.add(tiltGroup);

  const ground = new Mesh(
    new PlaneGeometry(8, 8),
    new ShadowMaterial({
      opacity: hasShadowIntensity ? 0.1 : 0.1 * shadowIntensity,
      transparent: true,
    })
  );
  ground.rotation.x = -Math.PI / 2;
  ground.position.y = -0.92;
  ground.receiveShadow = true;
  scene.add(ground);

  const raycaster = new Raycaster();
  const pointer = new Vector2();
  const clock = new Clock();
  const tilt = { x: 0, y: 0 };
  let frame = 0;
  let running = true;
  const pageCount = book.sheets.length;

  const setPointer = (event) => {
    const rect = canvas.getBoundingClientRect();
    pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
  };

  const pickPage = () => {
    raycaster.setFromCamera(pointer, camera);
    const hits = raycaster.intersectObjects(book.meshes, false);
    if (!hits.length) return null;
    return hits[0].object.userData.pageIndex;
  };

  const hintTarget = { x: 0, y: 0 };
  const hintPos = { x: 0, y: 0 };
  let hintShow = false;
  let hintVis = 0;

  const applyHint = () => {
    if (!hint) return;
    const scale = 0.82 + 0.18 * hintVis;
    hint.style.opacity = String(hintVis);
    hint.style.transform = `translate3d(${hintPos.x}px, ${hintPos.y}px, 0) translate(-50%, -50%) scale(${scale})`;
  };

  const onMove = (event) => {
    const rect = wrap.getBoundingClientRect();
    if (rect.width && rect.height) {
      tilt.x = clamp(((event.clientX - rect.left) / rect.width) * 2 - 1, -1, 1);
      tilt.y = clamp(((event.clientY - rect.top) / rect.height) * 2 - 1, -1, 1);
    }
    if (!interactive) return;
    setPointer(event);
    const index = pickPage();
    wrap.style.cursor = index !== null ? "pointer" : "default";
    canvas.style.cursor = index !== null ? "pointer" : "default";
    book.highlight(index);
    hintShow = Boolean(hint) && index !== null && !book.sheets[0].opened;
    if (hintShow) {
      hintTarget.x = event.clientX - rect.left;
      hintTarget.y = event.clientY - rect.top;
      if (hintVis < 0.02) {
        hintPos.x = hintTarget.x;
        hintPos.y = hintTarget.y;
      }
    }
  };

  const onClick = (event) => {
    if (!interactive) return;
    setPointer(event);
    const index = pickPage();
    if (index === null) {
      book.setPage(0);
      book.highlight(null);
      return;
    }
    const opened = book.sheets[index].opened;
    book.setPage(opened ? index : index + 1);
    book.highlight(null);
    hintShow = false;
  };

  const onLeave = () => {
    tilt.x = 0;
    tilt.y = 0;
    wrap.style.cursor = "default";
    canvas.style.cursor = "default";
    book.highlight(null);
    hintShow = false;
  };

  const resize = () => {
    const { clientWidth, clientHeight } = wrap;
    if (!clientWidth || !clientHeight) return;
    camera.aspect = clientWidth / clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(clientWidth, clientHeight, false);
  };

  const tick = () => {
    if (!running) return;
    const delta = Math.min(clock.getDelta(), 1 / 30);
    book.update(delta);

    if (hint) {
      const followHint = 1 - Math.exp(-12 * delta);
      const openHint = 1 - Math.exp(-9 * delta);
      hintVis += ((hintShow ? 1 : 0) - hintVis) * openHint;
      hintPos.x += (hintTarget.x - hintPos.x) * followHint;
      hintPos.y += (hintTarget.y - hintPos.y) * followHint;
      applyHint();
    }

    const idle = Math.abs(tilt.x) < 0.001 && Math.abs(tilt.y) < 0.001;
    const follow = delta * (idle ? TILT_RETURN : TILT_FOLLOW);
    const targetX = -tilt.y * MathUtils.degToRad(TILT_PITCH * tiltStrength);
    const targetY = tilt.x * MathUtils.degToRad(TILT_YAW * tiltStrength);
    const targetZ = -tilt.x * MathUtils.degToRad(TILT_ROLL * tiltStrength);
    tiltGroup.rotation.x += (targetX - tiltGroup.rotation.x) * follow;
    tiltGroup.rotation.y += (targetY - tiltGroup.rotation.y) * follow;
    tiltGroup.rotation.z += (targetZ - tiltGroup.rotation.z) * follow;

    renderer.render(scene, camera);
    frame = requestAnimationFrame(tick);
  };

  resize();
  tick();

  const observer = new ResizeObserver(resize);
  observer.observe(wrap);
  const vis = new IntersectionObserver(
    ([entry]) => {
      const visible = Boolean(entry?.isIntersecting);
      if (visible && !running) {
        running = true;
        clock.getDelta();
        tick();
      } else if (!visible && running) {
        running = false;
        cancelAnimationFrame(frame);
      }
    },
    { rootMargin: "20% 0px", threshold: 0 }
  );
  vis.observe(wrap.parentElement ?? wrap);

  wrap.style.pointerEvents = "auto";
  canvas.style.display = "block";
  canvas.style.width = "100%";
  canvas.style.height = "100%";
  canvas.style.pointerEvents = "auto";
  const embed = canvas.parentElement;
  if (embed && embed !== wrap) {
    embed.style.display = "block";
    embed.style.width = "100%";
    embed.style.height = "100%";
    embed.style.pointerEvents = "auto";
  }
  wrap
    .closest("[data-featured-stage]")
    ?.querySelectorAll("[data-featured-overlay], [data-featured-strips]")
    .forEach((el) => {
      el.style.pointerEvents = "none";
    });

  wrap.addEventListener("pointermove", onMove, { passive: true });
  wrap.addEventListener("pointerleave", onLeave);
  canvas.addEventListener("click", onClick);

  const api = {
    canvas,
    pageCount,
    open(page = 1) {
      book.setPage(Math.max(1, Math.min(pageCount, page)));
    },
    close() {
      book.setPage(0);
    },
    setPage(page) {
      book.setPage(page);
    },
    dispose() {
      running = false;
      cancelAnimationFrame(frame);
      observer.disconnect();
      vis.disconnect();
      wrap.removeEventListener("pointermove", onMove);
      wrap.removeEventListener("pointerleave", onLeave);
      canvas.removeEventListener("click", onClick);
      book.dispose();
      ground.geometry.dispose();
      ground.material.dispose();
      renderer.dispose();
      wrap.style.cursor = "default";
    },
  };

  canvas.dispatchEvent(new CustomEvent("book:ready", { detail: api, bubbles: true }));
  return api;
}

function init() {
  if (typeof window.THREE === "undefined") {
    console.warn("[book] Three.js is not loaded");
    return;
  }

  window.site = window.site || {};
  window.site.books = window.site.books || new Map();

  document.querySelectorAll("[data-book]").forEach((canvas) => {
    if (window.site.books.has(canvas)) return;
    const api = mountBook(canvas);
    if (api) window.site.books.set(canvas, api);
  });
}

onReady(init);
