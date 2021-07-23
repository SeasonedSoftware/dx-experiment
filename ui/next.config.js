const withTM = require('next-transpile-modules')(['domain-logic', 'jobs'])

module.exports = withTM({
  async redirects() {
    return [
      {
        source: '/',
        destination: '/tasks/all',
        permanent: false,
      },
    ]
  },
})
