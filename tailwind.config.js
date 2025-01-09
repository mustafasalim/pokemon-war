/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      keyframes: {
        "move-right": {
          "0%": {
            transform: "translate(0, -50%) rotate(0deg)",
            opacity: "0.8",
          },
          "10%": {
            opacity: "1",
          },
          "90%": {
            opacity: "1",
          },
          "100%": {
            transform: "translate(calc(50vw - 200px), -50%) rotate(360deg)",
            opacity: "0.8",
          },
        },
        "move-left": {
          "0%": {
            transform: "translate(0, -50%) rotate(0deg) scaleX(-1)",
            opacity: "0.8",
          },
          "10%": {
            opacity: "1",
          },
          "90%": {
            opacity: "1",
          },
          "100%": {
            transform:
              "translate(calc(-50vw + 200px), -50%) rotate(-360deg) scaleX(-1)",
            opacity: "0.8",
          },
        },
      },
      animation: {
        "move-right": "move-right 1s ease-in-out",
        "move-left": "move-left 1s ease-in-out",
      },
    },
  },
  plugins: [],
}
