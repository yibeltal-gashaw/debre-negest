/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{html,js}",
    "./src/views/**/*.html",
    "./src/js/**/*.js",
    "./**/*.{html,js}",
  ],
  safelist: [
    // Colors and backgrounds
    'bg-.*',
    'text-.*',
    'border-.*',
    'ring-.*',
    // Spacing
    'p-.*',
    'm-.*',
    'px-.*',
    'py-.*',
    'mx-.*',
    'my-.*',
    // Sizing
    'w-.*',
    'h-.*',
    'min-w-.*',
    'min-h-.*',
    'max-w-.*',
    'max-h-.*',
    // Typography
    'text-.*',
    'font-.*',
    'leading-.*',
    'tracking-.*',
    // Flexbox and Grid
    'flex-.*',
    'grid-.*',
    'gap-.*',
    'col-.*',
    'row-.*',
    // Positioning
    'absolute',
    'relative',
    'fixed',
    'sticky',
    'inset-.*',
    // Display
    'block',
    'inline-block',
    'inline',
    'hidden',
    'flex',
    'grid',
    // Shadows, borders, effects
    'shadow-.*',
    'rounded-.*',
    'opacity-.*',
    // Add more patterns as needed for your project
  ],
  darkMode: 'class',
  theme: {
    extend: {},
  },
  plugins: [],
};