import { InferGetStaticPropsType } from 'next'
import { stories } from 'domain-logic/stories'
import useSWR from 'swr'
import StoryForm from 'components/homepage/story-form'
import StoryItem from 'components/story-item'

export default function TodosPage({
  initialData,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const { data } = useSWR('stories', stories.all.run, {
    initialData,
  })
  return (
    <div className="layout">
      <header className="border-b border-gray-100 border-opacity-20 w-full pb-3">
        <h1 className="text-center text-4xl text-red-800 dark:text-green-600 font-thin">
          Stories
        </h1>
      </header>
      <main className="flex flex-col flex-grow md:flex-row gap-8 items-center md:items-start pt-6 md:max-w-[50rem] w-full">
        <section className="flex flex-col justify-center items-center min-w-[20rem] bg-white dark:bg-gray-800">
          <StoryForm />
        </section>
        <div className="flex-grow flex flex-col w-full border border-gray-100 border-opacity-20 divide-y divide-gray-100 divide-opacity-20">
          {data?.map((story) => (
            <StoryItem key={story.id} {...story} />
          ))}
        </div>
      </main>
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
