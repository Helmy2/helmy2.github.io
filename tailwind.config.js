const path = require("path");

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    path.join(__dirname, "index.html"),
    path.join(__dirname, "js/**/*.js"),
  ],
  theme: {
    extend: {
      colors: {
        primary: "#FF2E9A",
        secondary: "#29F1FF",
        tertiary: "#FFE24C",
        xp: "#4CFF7A",
        background: "#0B0714",
        surface: "#150C29",
        "surface-high": "#1D1238",
        "surface-low": "#0E081C",
        ink: "#ECE7FB",
        "ink-muted": "#A79BD1",
        line: "#3A2A5C",
      },
      borderRadius: {
        DEFAULT: "0px",
        lg: "0px",
        xl: "0px",
        full: "9999px",
      },
      spacing: {
        "margin-mobile": "20px",
        "margin-desktop": "64px",
        "container-max": "1200px",
        "section-gap": "96px",
      },
      fontFamily: {
        pixel: ["'Press Start 2P'", "monospace"],
        term: ["'VT323'", "monospace"],
        mono: ["'JetBrains Mono'", "monospace"],
      },
    },
  },
  plugins: [],
};
