import { InferGetStaticPropsType } from 'next'
import { stories } from 'domain-logic/stories'
import useSWR from 'swr'
import StoryForm from 'components/homepage/story-form'
import StoryItem from 'components/story-item'
import FooterInfo from 'components/footer-info'
import { useState } from 'react'

export default function TodosPage({
  initialData,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const { data } = useSWR('stories', stories.all.run, {
    initialData,
  })
  const [editing, setEditing] = useState<string | null>(null)

  return (
    <div className="flex flex-col w-screen min-h-screen overflow-y-auto p-4 items-center justify-center bg-gray-50 dark:bg-gray-900 dark:text-white">
      <header className="border-b border-gray-200 dark:border-gray-800 w-full pb-3">
        <h1 className="text-center text-4xl text-red-800 dark:text-green-600 font-thin">
          Stories
        </h1>
      </header>
      <main className="flex flex-col flex-grow md:flex-row gap-8 items-center md:items-start pt-6 md:max-w-[50rem] w-full">
        <section className="flex flex-col justify-center items-center w-full md:min-w-[20rem] bg-white dark:bg-gray-800">
          <StoryForm setEditing={setEditing} list={data} editing={editing} />
        </section>
        <div className="flex-grow flex flex-col w-full border border-gray-800 dark:border-gray-700 border-opacity-20 divide-y divide-gray-800 dark:divide-gray-700 divide-opacity-20">
          {data?.map((story) => (
            <StoryItem key={story.id} story={story} setEditing={setEditing} />
          ))}
        </div>
      </main>
      <FooterInfo />
    </div>
  )
}

export const getStaticProps = async () => {
  const storyList = await stories.all.run()
  const initialData = storyList.map((story) => ({...story, createdAt: story.createdAt.toISOString()}))

  return {
    props: { initialData },
    revalidate: 10,
  }
}
