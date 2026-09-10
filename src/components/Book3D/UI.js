const innerPages = Array.from({ length: 4 }, (_, i) => ({
  front: i % 2 === 0 ? "quote" : "notes",
  back: i % 2 === 0 ? "notes" : "blank",
}));

export const pages = [
  { front: "cover", back: "contents" },
  ...innerPages,
  { front: "blank", back: "backcover" },
];
