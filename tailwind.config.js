module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}', './index.html'],
  darkMode: 'media',
  theme: {
    extend: {
      zIndex: {
        // To fix materialize.css header z-index issue
        1300: '1300',
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
  corePlugins: {
    // Disabling preflight because it conflicts with MaterializeCSS
    preflight: false,
  },
}
