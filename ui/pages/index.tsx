import { stories } from 'domain-logic/stories'
import useSWR from 'swr'
import StoryForm from 'components/homepage/story-form'
import FooterInfo from 'components/footer-info'
import FilteredStories from 'components/filtered-stories'
import { useState } from 'react'

export default function HomePage() {
  const { data, mutate } = useSWR('stories', stories.all.run)
  const [editing, setEditing] = useState<string | null>(null)

  const changePosition =
    (
      storyId: string,
      relativePosition: 'before' | 'after',
      storyAnchor?: string
    ) =>
    async () => {
      if (!storyAnchor) return

      const list = await stories.setPosition.run({
        storyAnchor,
        relativePosition,
        storyId,
      })
      mutate(list, false)
    }

  return (
    <div className="flex flex-col items-center justify-center w-screen min-h-screen p-4 overflow-y-auto bg-gray-50 dark:bg-gray-900 dark:text-white">
      <header className="w-full pb-3 border-b border-gray-200 dark:border-gray-800">
        <h1 className="text-4xl font-thin text-center text-red-800 dark:text-green-600">
          Stories
        </h1>
      </header>
      <main className="flex flex-col flex-grow md:flex-row gap-8 items-center md:items-start pt-6 md:max-w-[50rem] w-full">
        <section className="flex flex-col justify-center items-center w-full md:min-w-[20rem] bg-white dark:bg-gray-800">
          <StoryForm setEditing={setEditing} list={data} editing={editing} />
        </section>
        <div className="flex flex-col gap-2">
          <FilteredStories
            stories={data}
            filterByState="ready"
            changePosition={changePosition}
            mutateStories={mutate}
            setEditing={setEditing}
          />
          <FilteredStories
            stories={data}
            filterByState="pending"
            changePosition={changePosition}
            mutateStories={mutate}
            setEditing={setEditing}
          />
        </div>
      </main>
      <FooterInfo />
    </div>
  )
}
