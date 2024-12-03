/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    './src/layouts/**/*.{js,ts,jsx,tsx,mdx}',
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          1: '#580d9e',
          2: '#8649bf',
          3: '#9f73c8',
          4: '#baa0d2',
          5: '#5e2f8a',
          6: '#4b3164',
          7: '#292131',
          8: '#292131',
        },
        secondary: {
          1: '#202020',
          2: '#303030',
          3: '#404040',
          4: '#505050',
          5: '#606060',
          6: '#707070',
          7: '#808080',
          8: '#909090',
          9: '#aaaaaa',
        },
        background: {
          1: '#121212',
          2: '#161616',
          3: '#181818',
          4: '#202020',
          5: '#222222',
          6: '#242424',
          7: '#262626',
          8: '#000000',
        },
        foreground: {
          1: '#ffffff',
          2: '#bdbdbd',
          3: '#a7a7a7',
          4: '#797979',
          5: '#555555',
          6: '#414141',
          7: '#353535',
          8: '#181818',
        },
        default: {
          1: '#14A44D',
          2: '#DC4C64',
          3: '#E4A11B',
        },
      },
    },
  },
  darkMode: "class",
  plugins: [],
}
