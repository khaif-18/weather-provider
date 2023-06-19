module.exports = {
  experimental: { appDir: false },
  output: 'standalone',
  images: {
    domains: ['openweathermap.org'],
  },
  async redirects() {
    return [
      {
        source: '/',
        destination: '/home',
        permanent: false,
      },
    ];
  },
};
