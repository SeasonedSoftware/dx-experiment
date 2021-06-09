import type { AppProps } from 'next/app'
import Head from 'next/head'

import 'styles/global.css'

function SeasonedApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Todos</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Component {...pageProps} />
    </>
  )
}

export default SeasonedApp
