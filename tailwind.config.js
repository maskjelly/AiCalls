/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      typography: {
        DEFAULT: {
          css: {
            color: 'rgb(255 255 255 / 0.9)',
            maxWidth: 'none',
            hr: {
              borderColor: 'rgb(255 255 255 / 0.1)',
              marginTop: '2em',
              marginBottom: '2em',
            },
            'h1, h2, h3, h4': {
              color: 'rgb(255 255 255 / 0.9)',
            },
            a: {
              color: '#60A5FA',
              '&:hover': {
                color: '#93C5FD',
              },
            },
            code: {
              background: 'rgb(0 0 0 / 0.2)',
              padding: '0.25rem 0.375rem',
              borderRadius: '0.25rem',
              color: 'rgb(255 255 255 / 0.9)',
            },
            pre: {
              background: 'rgb(0 0 0 / 0.4)',
              code: {
                background: 'transparent',
                padding: 0,
              },
            },
          },
        },
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
} 