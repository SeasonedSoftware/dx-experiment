const withTM = require('next-transpile-modules')(['domain-logic'])

module.exports = withTM({
  experimental: { esmExternals: true },
})
