const withPWA = require('next-pwa')({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
});

module.exports = {
  env: {
    siteTitle: 'Breizhsport',
    siteDescription: 'Magasin spécialisée en vente de matériel de sport',
    siteKeywords: 'matériel sportif, sports, outdoor, fitness',
    siteUrl: 'https://www.doggystickers.xyz',
    siteImagePreviewUrl: '/images/main.jpg',
    twitterHandle: '@deepwhitman',
  },
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: '13.36.176.61',
        port: '',
      },
    ],
  },
};

module.exports = withPWA(module.exports);
