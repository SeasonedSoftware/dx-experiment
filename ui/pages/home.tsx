import { InferGetStaticPropsType } from 'next'
import { messages } from 'domain-logic/messages'

const { run: fetchMessage } = messages.hello

export default function HomePage({ message }: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <div>
      <h1>{message}</h1>
    </div>
  )
}

export const getStaticProps = async () => {
  const message = await fetchMessage()

  return {
    props: {
      message
    }
  }
}
