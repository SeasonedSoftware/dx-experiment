module.exports = {
  async redirects() {
    return [
      {
        source: '/',
        destination: '/tasks/all',
        permanent: false,
      },
    ]
  },
}
