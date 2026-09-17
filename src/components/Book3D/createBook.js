import {
  Bone,
  BoxGeometry,
  Color,
  Float32BufferAttribute,
  Group,
  MathUtils,
  MeshPhysicalMaterial,
  MeshStandardMaterial,
  Skeleton,
  SkinnedMesh,
  Uint16BufferAttribute,
  Vector3,
} from "three";
import { CONFIG } from "./config";
import { createPageTexture } from "./textures";

const easingFactor = 0.5;
const PAGE_CLOSED_Y = Math.PI / 2;

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

const paperColor = new Color("#ffffff");
const emissiveColor = new Color("#FF3621");

const mattePaper = {
  roughness: 0.72,
  metalness: 0,
  envMapIntensity: 0,
};

function createEdgeMaterials() {
  return [
    new MeshStandardMaterial({ color: "#EFE9E1", ...mattePaper }),
    new MeshStandardMaterial({ color: "#1A1A1A", ...mattePaper, roughness: 0.88 }),
    new MeshStandardMaterial({ color: "#EFE9E1", ...mattePaper }),
    new MeshStandardMaterial({ color: "#E8E1D8", ...mattePaper }),
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

function pageSide(page, index) {
  return {
    kind: "page",
    layout: page.layout ?? "article",
    kicker: page.kicker ?? "",
    heading: page.heading ?? "",
    body: page.body ?? "",
    items: page.items ?? [],
    sections: page.sections ?? [],
    black: Boolean(page.black),
    slot: index + 1,
  };
}

function sheetsFromPages(content, coverKind) {
  const pages = content.pages ?? [];
  const sheets = [
    {
      front: { kind: coverKind },
      back: pages[0] ? pageSide(pages[0], 0) : { kind: "backcover" },
    },
  ];
  for (let i = 1; i < pages.length; i += 2) {
    sheets.push({
      front: pageSide(pages[i], i),
      back: pages[i + 1] ? pageSide(pages[i + 1], i + 1) : { kind: "backcover" },
    });
  }
  return sheets;
}

function createSkinnedPage(number, front, back, pageCount, edgeMaterials, content) {
  const bones = [];
  for (let i = 0; i <= PAGE_SEGMENTS; i++) {
    const bone = new Bone();
    bones.push(bone);
    bone.position.x = i === 0 ? 0 : SEGMENT_WIDTH;
    if (i > 0) bones[i - 1].add(bone);
  }

  const skeleton = new Skeleton(bones);
  const picture = createPageTexture(front, content);
  const picture2 = createPageTexture(back, content);
  const isCover = number === 0 || number === pageCount - 1;
  const roughness = isCover ? 0.32 : 0.68;

  const materials = [
    ...edgeMaterials,
    new MeshPhysicalMaterial({
      color: paperColor,
      map: picture,
      roughness,
      metalness: 0,
      clearcoat: isCover ? 0.24 : 0.06,
      clearcoatRoughness: isCover ? 0.78 : 0.9,
      envMapIntensity: 0,
      emissive: emissiveColor,
      emissiveIntensity: 0,
    }),
    new MeshPhysicalMaterial({
      color: paperColor,
      map: picture2,
      roughness,
      metalness: 0,
      clearcoat: isCover ? 0.24 : 0.06,
      clearcoatRoughness: isCover ? 0.78 : 0.9,
      envMapIntensity: 0,
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
  constructor(number, front, back, pageCount, edgeMaterials, content) {
    this.number = number;
    this.opened = false;
    this.highlighted = false;
    this.group = new Group();
    this.group.rotation.y = Math.PI / 2;
    this.mesh = createSkinnedPage(
      number,
      front,
      back,
      pageCount,
      edgeMaterials,
      content
    );
    this.group.add(this.mesh);
    this.openY = -((content.openAngle ?? 50) * Math.PI) / 180;
  }

  setState({ opened, page, bookClosed }) {
    this.opened = opened;
    this.bookClosed = bookClosed;
    this.mesh.position.z = -this.number * PAGE_DEPTH + page * PAGE_DEPTH;
  }

  update(delta) {
    const emissiveIntensity = this.highlighted ? 0.42 : 0;
    this.mesh.material[4].emissiveIntensity = this.mesh.material[5].emissiveIntensity =
      MathUtils.lerp(
        this.mesh.material[4].emissiveIntensity,
        emissiveIntensity,
        0.22
      );

    let targetRotation = this.opened ? this.openY : PAGE_CLOSED_Y;
    if (!this.bookClosed) {
      targetRotation += degToRad(this.number * 0.8);
    }

    const bones = this.mesh.skeleton.bones;
    for (let i = 0; i < bones.length; i++) {
      const target = i === 0 ? this.group : bones[i];
      dampAngle(target.rotation, "y", i === 0 ? targetRotation : 0, easingFactor, delta);
      dampAngle(target.rotation, "x", 0, easingFactor, delta);
    }
  }
}

export function createBook(cover = "cover", content = CONFIG) {
  const pageList = sheetsFromPages(content, cover);
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
        edgeMaterials,
        content
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
