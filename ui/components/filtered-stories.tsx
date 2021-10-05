import StoryItem from 'components/story-item'
import { Story } from 'domain-logic/stories'
import { any } from 'lodash/fp'
import type { MutatorCallback } from 'swr/dist/types'

type Props = {
  stories: Story[]
  filterByState: 'pending' | 'ready' | 'approved'
  changePosition: (
    storyId: string,
    relativePosition: 'before' | 'after',
    storyAnchor?: string
  ) => void
  setEditing: (a: string | null) => void
  mutateStories: (
    data?: Story[] | Promise<Story[]> | MutatorCallback<Story[]>,
    shouldRevalidate?: boolean
  ) => Promise<Story[] | undefined>
}

export default function FilteredStories({
  stories,
  filterByState,
  changePosition,
  mutateStories,
  setEditing,
}: any) {
  const filteredStories =
    stories?.filter((story: any) => story.state == filterByState) ?? []

  return (
    <div>
      <h1 className="block mb-2 text-xl">{filterByState} stories</h1>
      <div
        id="backlog"
        className="flex flex-col flex-grow w-full border border-gray-800 divide-y divide-gray-800 dark:border-gray-700 border-opacity-20 dark:divide-gray-700 divide-opacity-20"
      >
        {filteredStories.length ? (
          filteredStories.map((story: any, idx: number) => (
            <StoryItem
              key={story.id}
              story={story}
              mutateStories={mutateStories}
              setEditing={setEditing}
              onClickBefore={changePosition(
                story.id,
                'before',
                stories[idx - 1]?.id
              )}
              onClickAfter={changePosition(
                story.id,
                'after',
                stories[idx + 1]?.id
              )}
            />
          ))
        ) : (
          <div className="p-4 text-center">
            There are no {filterByState} Stories
          </div>
        )}
      </div>
    </div>
  )
}
