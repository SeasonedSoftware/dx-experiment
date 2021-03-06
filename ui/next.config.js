const withTM = require('next-transpile-modules')(['domain-logic'])

module.exports = withTM({
  experimental: { esmExternals: true },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: securityHeaders,
      },
    ]
  },
})

// The declaration below will allow Youtube Videos and Google Fonts
const ContentSecurityPolicy = `
  default-src 'self';
  script-src 'self'${
    process.env.NODE_ENV === 'development' ? ` 'unsafe-eval'` : ''
  } *.youtube.com;
  child-src *.youtube.com;
  style-src 'self'${
    process.env.NODE_ENV === 'development' ? ` 'unsafe-inline'` : ''
  } *.googleapis.com;
  img-src * blob: data:;
  media-src 'none';
  font-src 'self';
`

const securityHeaders = [
  {
    key: 'Content-Security-Policy',
    value: ContentSecurityPolicy.replace(/\n/g, ''),
  },
  {
    key: 'Referrer-Policy',
    value: 'origin-when-cross-origin',
  },
  {
    key: 'X-Frame-Options',
    value: 'DENY',
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff',
  },
  {
    key: 'X-DNS-Prefetch-Control',
    value: 'on',
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=31536000; includeSubDomains; preload',
  },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=()',
  },
]
