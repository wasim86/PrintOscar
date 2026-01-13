/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        // Override default orange colors with golden palette
        orange: {
          50: '#fefdf8',
          100: '#fdf9e8',
          200: '#fbf2c5',
          300: '#f7e898',
          400: '#f1db69',
          500: '#ddc464',
          600: '#c8a84d',
          700: '#a68a3f',
          800: '#876f35',
          900: '#6f5b2e',
        },
      },
    },
  },
  plugins: [],
}
