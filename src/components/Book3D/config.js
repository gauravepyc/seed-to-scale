export const CONFIG = {
  openAngle: 50,
  series: "THE WORKING KNOWLEDGE",
  author: "TARUN RAHEJA  ·  ACCEL  ·  21 SEPT 2026",
  cover: {
    number: "01",
    badge: "V1.0",
    title: ["Harness", "Engineering"],
  },
  back: {
    title: "The Working Knowledge",
    credit: "TARUN RAHEJA  ·  ACCEL  ·  21 SEPT 2026",
  },
  pages: [
    {
      layout: "intro",
      kicker: "THE FILE",
      body: "This playbook discusses how to extend frontier model capabilities via Harness Engineering, and how to durably retain your moat.",
    },
    {
      layout: "index",
      kicker: "INDEX",
      items: [
        "Benchmarking model capabilities in your domain",
        "Harness engineering to improve frontier performance",
        "Productionizing and scaling up",
        "Retaining moats and staying ahead",
      ],
    },
    {
      layout: "sections",
      kicker: "THE FILE",
      sections: [
        {
          number: "01",
          heading: "BENCHMARKING MODEL CAPABILITIES IN YOUR DOMAIN",
          body: "Frontier models are superhuman at some tasks, and useless at others - unpredictably. We show ways to understand where the model is weak / strong in your domain in a principled manner.",
        },
        {
          number: "02",
          heading: "HARNESS ENGINEERING TO IMPROVE FRONTIER PERFORMANCE",
          body: "Simple prompts cannot elicit peak capabilities from frontier models. We show how to achieve it - with tools, context management, loops, decomposition - and how to cleanly measure improvements.",
        },
      ],
    },
    {
      layout: "sections",
      kicker: "THE FILE",
      sections: [
        {
          number: "03",
          heading: "PRODUCTIONIZING AND SCALING UP",
          body: "Demo harnesses are too unreliable and expensive in production. We show how you can build bulletproof evals, route model calls by reliability, and decide when fine-tuning is worth it.",
        },
        {
          number: "04",
          heading: "RETAINING MOATS AND STAYING AHEAD",
          body: "Every new model release makes parts of our harness unnecessary or unwieldy, and throttles performance. We show what to delete when, and what parts of it a competitor cannot copy.",
        },
      ],
    },
  ],
  variants: {
    frontier: {
      number: "02",
      badge: "IN PROGRESS",
      stamp: "IN PROGRESS",
      title: ["In the", "Making"],
    },
    teams: {
      number: "03",
      badge: "UPCOMING",
      stamp: "IN PROGRESS",
      title: ["Coming", "Next"],
    },
  },
};
