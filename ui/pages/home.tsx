import { InferGetStaticPropsType } from 'next'
import { messages } from '../../domain-logic/messages'
import { useEffect, useState } from 'react'

export default function HomePage({
  message,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const [data, setData] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const msg = await messages.hello.run()
      setData(msg)
    }
    fetchData()
  }, [data])

  return (
    <div>
      <h1>{message}</h1>
      <h1>{data}</h1>
    </div>
  )
}

export const getStaticProps = async () => {
  const message = await messages.hello.run()

  return { props: { message } }
}
