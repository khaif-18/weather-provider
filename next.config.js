module.exports = {
  experimental: { appDir: false },
  output: 'standalone',
  async redirects() {
    return [
      {
        source: '/',
        destination: '/home', // Matched parameters can be used in the destination
        permanent: false,
      },
    ];
  }
};