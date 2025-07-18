module.exports = {
  content: [
    "./views/**/*.ejs",
    "./views/partials/*.ejs"
  ],
  theme: {
    extend: {},
  },
  plugins: [require("@tailwindcss/typography"), require("daisyui")],
  daisyui: {
    themes: ["dim"],
  },
}