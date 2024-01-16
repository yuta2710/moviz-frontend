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
        "blue-gradient":
          "linear-gradient(180deg, rgba(47, 184, 255,0.42) 31.77%, #5c9df1 100%)",
      },
      backgroundColor: {
        "green-dark": "#176B87",
        "status-error": "#FEEFEF",
      },
      colors: {
        "dark-green": "#04364A",
        "spirit-lab": "#151027",
        "blue-dark": "#2FB8FF6B",
        "blue-light": "#0077D3",
        "ai4biz-green-quite-light": "#64CCC5",
        "status-error": "#DA1414",
      },
      fontFamily: {
        poppins: "'Poppins', sans-serif",
        noto: "Noto Sans",
        sf: "SF Pro Display",
      },
    },
  },
  plugins: [],
};
export default config;
