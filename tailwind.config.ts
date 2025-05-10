import type { Config } from "tailwindcss"

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/react-tailwindcss-datepicker/dist/index.esm.{js,ts}"
  ],
  theme: {
    extend: {
      opacity: {
        "1": "1",
        "0": "0"
      }
    }
  }
}

export default config
