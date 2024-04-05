/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    colors: {
      white: "#FFFFFF",
      black: "#242424",
      grey: "#F3F3F3",
      "dark-grey": "#6B6B6B",
      red: "#FF4E4E",
      transparent: "transparent",
      twitter: "#1DA1F2",
      purple: "#8B46FF",
      gray: "#1E1C2A",
      "gray-dark": "#403D51",
      "blue-gwen": "#2D6691",
      "colorcard":"#252836",
    },

    fontSize: {
      sm: "12px",
      base: "14px",
      xl: "16px",
      "2xl": "20px",
      "3xl": "28px",
      "4xl": "38px",
      "5xl": "50px",
      "738px":"738px",
      "191px":"191px",
    },
    

    extend: {
      fontFamily: {
        inter: ["'Inter'", "sans-serif"],
        gelasio: ["'Gelasio'", "serif"],
      },
      backgroundColor: {
        "gray-900": "#1E1C2A",
        "gray-dark": "#403D51",
        "blue-800": "#2D6691 ",
        "color-card":"#252836",
      },
      width: {
        '738px': '738px',
        '189px':'189px',
      },
      height: {
        '161px': '161px',
        '123px':'123px',
      },
    },
  },
  plugins: [
    require('tailwind-scrollbar-hide')
  ],
};
