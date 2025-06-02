/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/App.tsx", "./src/components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      fontFamily: {
        "bounded-black": ["Bounded-Black"],
        "bounded-bold": ["Bounded-Bold"],
        "bounded-extrabold": ["Bounded-ExtraBold"],
        "bounded-light": ["Bounded-Light"],
        "bounded-medium": ["Bounded-Medium"],
        "bounded-regular": ["Bounded-Regular"],
        "bounded-semibold": ["Bounded-SemiBold"],
        "bounded-thin": ["Bounded-Thin"],

        "onest-black": ["Onest-Black"],
        "onest-bold": ["Onest-Bold"],
        "onest-extrabold": ["Onest-ExtraBold"],
        "onest-extralight": ["Onest-ExtraLight"],
        "onest-light": ["Onest-Light"],
        "onest-medium": ["Onest-Medium"],
        "onest-regular": ["Onest-Regular"],
        "onest-semibold": ["Onest-SemiBold"],
        "onest-thin": ["Onest-Thin"],
      },
    },
    colors: {
      primary: "rgba(var(--primary-color))",
      accent_primary: "rgba(var(--accent-primary))",
      bg_primary: "rgba(var(--bg-primary))",
      text_primary: "rgba(var(--text-primary))",
      text_secondary: "rgba(var(--text-secondary))",
      navigation: "rgba(var(--navigation))",
      stroke: "rgba(var(--stroke))",
      accent_attention: "rgba(var(--accent-attention))",
      blur_bg_primary: "rgba(var(--blur-bg-primary))",
      text_tertiary: "rgba(var(--text-tertiary))",
      bg_task: "rgba(var(--bg-task))",
      text_quaternary: "rgba(var(--text-quaternary))",
      blur_bg_secondary: "rgba(var(--blur-bg-secondary))",
      bg_secondary: "rgba(var(--bg-secondary))",
    },
  },
  plugins: [
    ({ addBase }) => {
      addBase({
        ":root": {
          "--primary": "151, 93, 255, 1",
          "--accent-primary": "151, 93, 255, 1",
          "--bg-primary": "17, 17, 17, 1",
          "--text-primary": "255, 255, 255, 1",
          "--text-secondary": "135, 135, 135, 1",
          "--navigation": "34, 34, 34, 1",
          "--stroke": "41, 43, 45, 1",
          "--accent-attention": "255, 93, 96, 1",
          "--blur-bg-primary": "103, 103, 103, 0.5",
          "--text-tertiary": "182, 182, 182, 1",
          "--bg-task": "144, 144, 144, 0.1",
          "--text-quaternary": "0, 0, 0, 1",
          "--blur-bg-secondary": "34, 34, 34, 0.8",
          "--bg-secondary": "0, 0, 0, 0.85",
        },
      });
    },
  ],
};
