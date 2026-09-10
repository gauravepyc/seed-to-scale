import localFont from "next/font/local";

export const avenir = localFont({
  src: [
    {
      path: "./fonts/Avenir Light.ttf",
      weight: "300",
      style: "normal",
    },
    {
      path: "./fonts/Avenir Regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "./fonts/Avenir Medium.ttf",
      weight: "500",
      style: "normal",
    },
  ],
  variable: "--font-avenir",
  display: "swap",
});

export const fragmentSans = localFont({
  src: [
    {
      path: "./fonts/PPFragment-SansLight.otf",
      weight: "300",
      style: "normal",
    },
    {
      path: "./fonts/PPFragment-SansRegular.otf",
      weight: "400",
      style: "normal",
    },
  ],
  variable: "--font-fragment-sans",
  display: "swap",
});

export const fragmentGlare = localFont({
  src: [
    {
      path: "./fonts/PPFragment-GlareLight.otf",
      weight: "300",
      style: "normal",
    },
    {
      path: "./fonts/PPFragment-GlareRegular.otf",
      weight: "400",
      style: "normal",
    },
    {
      path: "./fonts/PPFragment-GlareExtraBold.otf",
      weight: "800",
      style: "normal",
    },
  ],
  variable: "--font-fragment-glare",
  display: "swap",
});
