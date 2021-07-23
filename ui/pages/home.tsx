import { InferGetStaticPropsType } from 'next'
import { messages } from '../../domain-logic/messages'

export default function HomePage({
  message,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <div>
      <h1>{message}</h1>
    </div>
  )
}

export const getStaticProps = async () => {
  const message = await messages.hello.run()

  return { props: { message } }
}
