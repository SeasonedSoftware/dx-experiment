import { stories, Story } from 'domain-logic/stories'
import useSWR from 'swr'
import StoryForm from 'components/homepage/story-form'
import FooterInfo from 'components/footer-info'
import { useState } from 'react'
import StoriesList from 'components/stories-list'
import { groupBy } from 'lodash'

export default function HomePage() {
  const { data } = useSWR('stories', stories.all.run)
  const [editing, setEditing] = useState<string | null>(null)

  const storyGroups = groupBy(data, 'state') as Record<Story['state'], Story[]>

  return (
    <div className="flex flex-col items-center justify-center w-screen min-h-screen p-4 overflow-y-auto bg-gray-50 dark:bg-gray-900 dark:text-white">
      <header className="w-full pb-3 border-b border-gray-200 dark:border-gray-800">
        <h1 className="text-4xl font-thin text-center text-red-800 dark:text-green-600">
          Stories
        </h1>
      </header>
      <main className="flex flex-col items-center flex-grow w-full gap-8 pt-6 md:flex-row md:items-start">
        <section className="flex flex-col items-center justify-center w-full bg-white md:w-96 dark:bg-gray-800">
          <StoryForm setEditing={setEditing} list={data} editing={editing} />
        </section>
        <div className="flex flex-col w-full gap-4 md:w-96">
          <StoriesList
            items={storyGroups.ready ?? []}
            title="Ready for development"
            setEditing={setEditing}
          />
          <StoriesList
            items={(storyGroups.draft ?? []).concat(storyGroups.draft_with_scenarios ?? [])}
            title="Draft"
            setEditing={setEditing}
          />
        </div>
        <div className="flex flex-col w-full gap-4 md:w-96">
          <StoriesList
            items={storyGroups.development ?? []}
            title="In development"
            setEditing={setEditing}
          />
          <StoriesList
            items={storyGroups.approved ?? []}
            title="Done"
            setEditing={setEditing}
          />
        </div>
      </main>
      <FooterInfo />
    </div>
  )
}
