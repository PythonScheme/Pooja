module.exports = {
  content: ["./views/home.ejs", "./views/about.ejs", "./views/404.ejs"],

  theme: {
    extend: {},
  },
  plugins: [require("@tailwindcss/typography", require("daisyui"))],
  daisyui: {
    themes: ["dim"],
  },
}
