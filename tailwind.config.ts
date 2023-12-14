import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      backgroundColor: {
        "green-dark": "#176B87",
      },
      colors: {
        "dark-green": "#04364A",
        "spirit-lab": "#151027",
        "ai4biz-green-quite-light": "#64CCC5",
      },
      fontFamily: {
        poppins: "'Poppins', sans-serif",
        noto: "Noto Sans",
      },
    },
  },
  plugins: [],
};
export default config;
