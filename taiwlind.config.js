module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primaryBg: '#222222',
        secondaryBg: '#2A2A2A',
        elevatedBg: '#303030',
        primaryText: '#FAF3E1',
        secondaryText: '#F5E7C6',
        mutedText: 'rgba(245,231,198,0.6)',
        invertedText: '#222222',
        accent: '#FA8112',
        accentHover: '#E9720F',
        accentBg: 'rgba(250,129,18,0.15)',
        accentBorder: 'rgba(250,129,18,0.35)',
        defaultBorder: 'rgba(255,255,255,0.08)',
      },
    },
  },
  plugins: [],
};