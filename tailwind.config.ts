import { type Config } from 'tailwindcss'
import { fontFamily } from 'tailwindcss/defaultTheme'

export default {
  content: ['./src/**/*.tsx', './src/**/*.ts'],
  theme: {
    colors: {
      navbar: '#f7e7d0',
      'bg-main': '#fffaf5',
      'dark-brown': '#794A3A',
      'light-brown': '#f4decb',
      white: '#ffffff',
      black: '#000000',
    },
    extend: {
      fontFamily: {
        sans: ['var(--font-geist-sans)', ...fontFamily.sans],
      },
    },
  },
  plugins: [],
} satisfies Config
