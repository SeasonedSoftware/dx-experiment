import { InferGetStaticPropsType } from 'next'
import { messages } from '../../domain-logic/messages'
import useSWR from 'swr'

export default function HomePage({
  message,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const { data } = useSWR('hello', messages.hello.run, { initialData: message })

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
