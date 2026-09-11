"use client";

import { useEffect, useRef } from "react";
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
  Scene,
  ShadowMaterial,
  SRGBColorSpace,
  Vector2,
  WebGLRenderer,
} from "three";
import useTiltInput from "@/components/Reusable/useTiltInput";
import { createBook } from "./createBook";

const TILT_PITCH = 18;
const TILT_YAW = 24;
const TILT_ROLL = 10;
const TILT_FOLLOW = 7;
const TILT_RETURN = 4.5;

const COVERS = {
  harness: "cover",
  frontier: "cover-frontier",
  teams: "cover-teams",
};

export default function BookCanvas({
  variant = "harness",
  interactive = true,
  restRotation = [0, 0, 0],
  cameraDistance = 3.7,
}) {
  const wrapRef = useRef(null);
  const canvasRef = useRef(null);
  const tilt = useTiltInput(wrapRef);
  const cover = COVERS[variant] ?? "cover";
  const [restX, restY, restZ] = restRotation;

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;

    const renderer = new WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, interactive ? 2 : 1.25));
    renderer.shadowMap.enabled = interactive;
    renderer.shadowMap.type = PCFSoftShadowMap;
    renderer.outputColorSpace = SRGBColorSpace;
    renderer.toneMapping = ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.18;
    renderer.setClearColor(0x000000, 0);

    const scene = new Scene();
    const camera = new PerspectiveCamera(42, 1, 0.1, 50);
    camera.position.set(0, 0, cameraDistance);
    camera.lookAt(0, 0, 0);

    scene.add(new AmbientLight(0xfff6ec, 0.62));
    scene.add(new HemisphereLight(0xfff8f2, 0xc4b6a4, 0.78));

    const key = new DirectionalLight(0xfff8f2, interactive ? 1.22 : 1.38);
    key.position.set(2.6, 3.8, 3.4);
    key.castShadow = interactive;
    key.shadow.mapSize.set(1024, 1024);
    key.shadow.radius = 8;
    key.shadow.intensity = 0.18;
    key.shadow.bias = -0.0015;
    key.shadow.normalBias = 0.035;
    key.shadow.camera.near = 1;
    key.shadow.camera.far = 14;
    key.shadow.camera.left = -3.2;
    key.shadow.camera.right = 3.2;
    key.shadow.camera.top = 3.2;
    key.shadow.camera.bottom = -3.2;
    scene.add(key);

    const fill = new DirectionalLight(0xfff4e8, 0.58);
    fill.position.set(-3.4, 1.6, 2.6);
    scene.add(fill);

    const bounce = new DirectionalLight(0xfff8f2, 0.42);
    bounce.position.set(-1.1, 2.4, 3.2);
    scene.add(bounce);

    const rim = new DirectionalLight(0xefe9e1, 0.48);
    rim.position.set(-1.4, 2.6, -3.6);
    scene.add(rim);

    const book = createBook(cover);
    book.meshes.forEach((mesh) => {
      mesh.castShadow = interactive;
    });
    const tiltGroup = new Group();
    const pivot = new Group();
    pivot.rotation.set(restX, restY, restZ);
    pivot.add(book.group);
    tiltGroup.add(pivot);
    scene.add(tiltGroup);

    const ground = new Mesh(
      new PlaneGeometry(8, 8),
      new ShadowMaterial({ opacity: 0.1, transparent: true })
    );
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -0.92;
    ground.receiveShadow = true;
    scene.add(ground);

    const raycaster = new Raycaster();
    const pointer = new Vector2();
    const clock = new Clock();
    let frame = 0;
    let hovering = false;
    let running = true;

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

    const onMove = (event) => {
      if (!interactive) return;
      setPointer(event);
      const index = pickPage();
      hovering = index !== null;
      wrap.style.cursor = hovering ? "pointer" : "default";
      book.highlight(index);
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
    };

    const onLeave = () => {
      hovering = false;
      wrap.style.cursor = "default";
      book.highlight(null);
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
      const rawDelta = clock.getDelta();
      const delta = Math.min(rawDelta, 1 / 30);
      book.update(delta);

      const tx = tilt.current.x;
      const ty = tilt.current.y;
      const idle = Math.abs(tx) < 0.001 && Math.abs(ty) < 0.001;
      const follow = delta * (idle ? TILT_RETURN : TILT_FOLLOW);

      const targetX = -ty * MathUtils.degToRad(TILT_PITCH);
      const targetY = tx * MathUtils.degToRad(TILT_YAW);
      const targetZ = -tx * MathUtils.degToRad(TILT_ROLL);

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
    const visTarget = wrap.parentElement ?? wrap;
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
    vis.observe(visTarget);
    canvas.addEventListener("pointermove", onMove);
    canvas.addEventListener("pointerleave", onLeave);
    canvas.addEventListener("click", onClick);

    return () => {
      running = false;
      cancelAnimationFrame(frame);
      observer.disconnect();
      vis.disconnect();
      canvas.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("pointerleave", onLeave);
      canvas.removeEventListener("click", onClick);
      book.dispose();
      ground.geometry.dispose();
      ground.material.dispose();
      renderer.dispose();
      wrap.style.cursor = "default";
    };
  }, [tilt, cover, interactive, restX, restY, restZ, cameraDistance]);

  return (
    <div ref={wrapRef} className="h-full w-full touch-pan-y">
      <canvas ref={canvasRef} className="block h-full w-full" />
    </div>
  );
}
