/** @type {import('tailwindcss').Config} */
module.exports = {
     content: [
          "./app/**/*.{js,jsx,ts,tsx}",
          "./components/**/*.{js,jsx,ts,tsx}",
     ],
     presets: [require("nativewind/preset")],
     theme: {
          extend: {
               colors: {
                    primary: {
                         DEFAULT: "#8B5CF6",
                         dark: "#7C3AED",
                    },
               },
          },
     },
     plugins: [],
};
