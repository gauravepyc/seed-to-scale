import {
  Bone,
  BoxGeometry,
  Color,
  Float32BufferAttribute,
  Group,
  MathUtils,
  MeshStandardMaterial,
  Skeleton,
  SkinnedMesh,
  Uint16BufferAttribute,
  Vector3,
} from "three";
import { pages } from "./UI";
import { createPageTexture } from "./textures";

const easingFactor = 0.5;
const easingFactorFold = 0.3;
const insideCurveStrength = 0.18;
const outsideCurveStrength = 0.05;
const turningCurveStrength = 0.09;

export const PAGE_WIDTH = 1.28;
export const PAGE_HEIGHT = 1.71;
export const PAGE_DEPTH = 0.01;
const PAGE_SEGMENTS = 30;
const SEGMENT_WIDTH = PAGE_WIDTH / PAGE_SEGMENTS;

const pageGeometry = new BoxGeometry(
  PAGE_WIDTH,
  PAGE_HEIGHT,
  PAGE_DEPTH,
  PAGE_SEGMENTS,
  2
);
pageGeometry.translate(PAGE_WIDTH / 2, 0, 0);

const position = pageGeometry.attributes.position;
const vertex = new Vector3();
const skinIndexes = [];
const skinWeights = [];

for (let i = 0; i < position.count; i++) {
  vertex.fromBufferAttribute(position, i);
  const x = vertex.x;
  const skinIndex = Math.max(0, Math.floor(x / SEGMENT_WIDTH));
  const skinWeight = (x % SEGMENT_WIDTH) / SEGMENT_WIDTH;
  skinIndexes.push(skinIndex, skinIndex + 1, 0, 0);
  skinWeights.push(1 - skinWeight, skinWeight, 0, 0);
}

pageGeometry.setAttribute(
  "skinIndex",
  new Uint16BufferAttribute(skinIndexes, 4)
);
pageGeometry.setAttribute(
  "skinWeight",
  new Float32BufferAttribute(skinWeights, 4)
);

const whiteColor = new Color("white");
const emissiveColor = new Color("#FF3621");

const mattePaper = {
  roughness: 0.92,
  metalness: 0,
  envMapIntensity: 0.12,
};

function createEdgeMaterials() {
  return [
    new MeshStandardMaterial({ color: "#E8DFD0", ...mattePaper }),
    new MeshStandardMaterial({ color: "#1A1A1A", ...mattePaper, roughness: 0.88 }),
    new MeshStandardMaterial({ color: "#F0EBE1", ...mattePaper }),
    new MeshStandardMaterial({ color: "#E6DDD0", ...mattePaper }),
  ];
}

function shortestAngle(from, to) {
  let delta = to - from;
  while (delta > Math.PI) delta -= Math.PI * 2;
  while (delta < -Math.PI) delta += Math.PI * 2;
  return delta;
}

function dampAngle(object, key, target, smoothTime, dt) {
  const current = object[key];
  const delta = shortestAngle(current, target);
  object[key] = current + delta * (1 - Math.exp((-1 / smoothTime) * dt));
}

function degToRad(deg) {
  return (deg * Math.PI) / 180;
}

function createSkinnedPage(number, front, back, pageCount, edgeMaterials) {
  const bones = [];
  for (let i = 0; i <= PAGE_SEGMENTS; i++) {
    const bone = new Bone();
    bones.push(bone);
    bone.position.x = i === 0 ? 0 : SEGMENT_WIDTH;
    if (i > 0) bones[i - 1].add(bone);
  }

  const skeleton = new Skeleton(bones);
  const picture = createPageTexture(front);
  const picture2 = createPageTexture(back);
  const isCover = number === 0 || number === pageCount - 1;
  const roughness = isCover ? 0.9 : 0.84;

  const materials = [
    ...edgeMaterials,
    new MeshStandardMaterial({
      color: whiteColor,
      map: picture,
      roughness,
      metalness: 0,
      envMapIntensity: isCover ? 0.16 : 0.1,
      emissive: emissiveColor,
      emissiveIntensity: 0,
    }),
    new MeshStandardMaterial({
      color: whiteColor,
      map: picture2,
      roughness,
      metalness: 0,
      envMapIntensity: isCover ? 0.16 : 0.1,
      emissive: emissiveColor,
      emissiveIntensity: 0,
    }),
  ];

  const mesh = new SkinnedMesh(pageGeometry.clone(), materials);
  mesh.castShadow = true;
  mesh.receiveShadow = false;
  mesh.frustumCulled = false;
  mesh.add(skeleton.bones[0]);
  mesh.bind(skeleton);
  mesh.userData.pageIndex = number;
  return mesh;
}

class PageSheet {
  constructor(number, front, back, pageCount, edgeMaterials) {
    this.number = number;
    this.opened = false;
    this.lastOpened = false;
    this.highlighted = false;
    this.turnedAt = 0;
    this.group = new Group();
    this.group.rotation.y = Math.PI / 2;
    this.mesh = createSkinnedPage(
      number,
      front,
      back,
      pageCount,
      edgeMaterials
    );
    this.group.add(this.mesh);
  }

  setState({ opened, page, bookClosed }) {
    this.opened = opened;
    this.bookClosed = bookClosed;
    this.mesh.position.z = -this.number * PAGE_DEPTH + page * PAGE_DEPTH;
  }

  update(delta) {
    const emissiveIntensity = this.highlighted ? 0.06 : 0;
    this.mesh.material[4].emissiveIntensity = this.mesh.material[5].emissiveIntensity =
      MathUtils.lerp(
        this.mesh.material[4].emissiveIntensity,
        emissiveIntensity,
        0.1
      );

    if (this.lastOpened !== this.opened) {
      this.turnedAt = Date.now();
      this.lastOpened = this.opened;
    }

    let turningTime = Math.min(400, Date.now() - this.turnedAt) / 400;
    turningTime = Math.sin(turningTime * Math.PI);

    let targetRotation = this.opened ? -Math.PI / 2 : Math.PI / 2;
    if (!this.bookClosed) {
      targetRotation += degToRad(this.number * 0.8);
    }

    const bones = this.mesh.skeleton.bones;
    for (let i = 0; i < bones.length; i++) {
      const target = i === 0 ? this.group : bones[i];
      const insideCurveIntensity = i < 8 ? Math.sin(i * 0.2 + 0.25) : 0;
      const outsideCurveIntensity = i >= 8 ? Math.cos(i * 0.3 + 0.09) : 0;
      const turningIntensity =
        Math.sin(i * Math.PI * (1 / bones.length)) * turningTime;

      let rotationAngle =
        insideCurveStrength * insideCurveIntensity * targetRotation -
        outsideCurveStrength * outsideCurveIntensity * targetRotation +
        turningCurveStrength * turningIntensity * targetRotation;
      let foldRotationAngle = degToRad(Math.sign(targetRotation) * 2);

      if (this.bookClosed) {
        if (i === 0) {
          rotationAngle = targetRotation;
          foldRotationAngle = 0;
        } else {
          rotationAngle = 0;
          foldRotationAngle = 0;
        }
      }

      dampAngle(target.rotation, "y", rotationAngle, easingFactor, delta);

      const foldIntensity =
        i > 8
          ? Math.sin(i * Math.PI * (1 / bones.length) - 0.5) * turningTime
          : 0;
      dampAngle(
        target.rotation,
        "x",
        foldRotationAngle * foldIntensity,
        easingFactorFold,
        delta
      );
    }
  }
}

export function createBook(cover = "cover") {
  const pageList = pages.map((pageData, index) =>
    index === 0 ? { ...pageData, front: cover } : pageData
  );
  const edgeMaterials = createEdgeMaterials();
  const group = new Group();
  group.rotation.y = -Math.PI / 2;
  group.position.x = -PAGE_WIDTH / 2;

  const sheets = pageList.map(
    (pageData, index) =>
      new PageSheet(
        index,
        pageData.front,
        pageData.back,
        pageList.length,
        edgeMaterials
      )
  );
  sheets.forEach((sheet) => group.add(sheet.group));

  let page = 0;
  let delayedPage = 0;
  let timeout = null;

  const applyPage = (value) => {
    delayedPage = value;
    const bookClosed = delayedPage === 0 || delayedPage === pageList.length;
    sheets.forEach((sheet, index) => {
      sheet.setState({
        opened: delayedPage > index,
        page: delayedPage,
        bookClosed,
      });
    });
  };

  applyPage(0);

  const stepToward = () => {
    if (page === delayedPage) return;
    timeout = setTimeout(
      () => {
        if (page > delayedPage) applyPage(delayedPage + 1);
        else if (page < delayedPage) applyPage(delayedPage - 1);
        stepToward();
      },
      Math.abs(page - delayedPage) > 2 ? 50 : 150
    );
  };

  return {
    group,
    meshes: sheets.map((sheet) => sheet.mesh),
    sheets,
    setPage(next) {
      page = Math.max(0, Math.min(pageList.length, next));
      clearTimeout(timeout);
      stepToward();
    },
    highlight(index) {
      sheets.forEach((sheet, i) => {
        sheet.highlighted = i === index;
      });
    },
    update(delta) {
      const targetX =
        delayedPage === 0
          ? -PAGE_WIDTH / 2
          : delayedPage === pageList.length
            ? PAGE_WIDTH / 2
            : 0;
      group.position.x +=
        (targetX - group.position.x) * (1 - Math.exp(-3.4 * delta));
      sheets.forEach((sheet) => sheet.update(delta));
    },
    dispose() {
      clearTimeout(timeout);
    },
  };
}
