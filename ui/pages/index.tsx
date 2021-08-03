import { InferGetStaticPropsType } from 'next'
import { stories } from 'domain-logic/stories'
import useSWR from 'swr'
import { FormEventHandler } from 'react'
import { Story } from '@prisma/client'

export default function TodosPage({
  initialData,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const { data, mutate } = useSWR('stories', stories.all.run, {
    initialData,
  })

  const handleSubmit: FormEventHandler = async (ev) => {
    ev.preventDefault()
    const formData = new FormData(ev.target as HTMLFormElement)
    const story = Object.fromEntries(formData) as unknown as Story
    await stories.create.run(story)
    mutate()
  }

  return (
    <div className="layout">
      <h1 className="text-center text-8xl text-red-800 dark:text-green-600 font-thin">
        Stories
      </h1>
      <section className="mt-8 bg-white dark:bg-gray-800 shadow-xl flex flex-col w-full max-w-[35rem]">
        <form className="flex flex-col" onSubmit={handleSubmit}>
          <input
            type="text"
            name="asA"
            className="p-4 text-2xl w-full dark:bg-gray-800 dark:border-b border-gray-600 dark:placeholder-gray-600"
            placeholder="As a"
            autoFocus
          />
          <input
            type="text"
            name="iWant"
            className="p-4 text-2xl w-full dark:bg-gray-800 dark:border-b border-gray-600 dark:placeholder-gray-600"
            placeholder="I want"
          />
          <input
            type="text"
            name="soThat"
            className="p-4 text-2xl w-full dark:bg-gray-800 dark:border-b border-gray-600 dark:placeholder-gray-600"
            placeholder="So that"
          />
          <button
            className="p-4 text-2xl bg-blue-900 text-center"
            type="submit"
          >
            Create
          </button>
        </form>
      </section>
      <div className="mt-8">
        {data?.map((story) => (
          <p className="mt-2" key={story.id}>
            As a <strong>{story.asA}</strong> I want{' '}
            <strong>{story.iWant}</strong> So that{' '}
            <strong>{story.soThat}</strong>.
          </p>
        ))}
      </div>
    </div>
  )
}

export const getStaticProps = async () => {
  const initialData = await stories.all.run()

  return {
    props: { initialData },
    revalidate: 10,
  }
}
