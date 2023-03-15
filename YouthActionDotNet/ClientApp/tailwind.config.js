/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}"],
  theme: {
    extend: {},
  },
  plugins:[
    require('daisyui'),
  ],
  daisyui:{
    themes:[
      {
        light:{
          ...require('daisyui/src/colors/themes')["[data-theme=light]"],
          "primary":"#1c2c5b",
          "primary-focus":"#2e4896",
        }
      }
    ]
  }
}
