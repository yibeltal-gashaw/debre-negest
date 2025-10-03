/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{html,js}",
    "./src/views/**/*.html", 
    "./src/js/**/*.js",
    "./**/*.{html,js}",
  ],
  // Temporarily enable all utilities for development
  corePlugins: {
    // Enable all core plugins
    preflight: true,
  },
  // ... rest of config
};