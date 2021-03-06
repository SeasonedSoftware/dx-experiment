import type { AppProps } from 'next/app'
import Head from 'next/head'

import '../public/styles.css'

function SeasonedApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>KODO</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Component {...pageProps} />
    </>
  )
}

export default SeasonedApp
