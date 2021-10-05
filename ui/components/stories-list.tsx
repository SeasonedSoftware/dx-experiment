import StoryItem from 'components/story-item'
import { stories, Story } from 'domain-logic/stories'
import { mutate } from 'swr'

type ChangePositionFn = (
  storyId: string,
  relativePosition: 'before' | 'after',
  storyAnchor?: string
) => () => Promise<void>

type Props = {
  items: Story[]
  title: string
  setEditing: (a: string | null) => void
}
export default function StoriesList({ items, title, setEditing }: Props) {
  const changePosition: ChangePositionFn =
    (storyId, relativePosition, storyAnchor) => async () => {
      if (!storyAnchor) return

      const list = await stories.setPosition.run({
        storyAnchor,
        relativePosition,
        storyId,
      })
      mutate('stories', list, false)
    }

  return (
    <div className="flex flex-col">
      {title && <h3 className="block mb-2 text-xl">{title}</h3>}
      <div className="flex flex-col flex-grow w-full border border-gray-800 divide-y divide-gray-800 dark:border-gray-700 border-opacity-20 dark:divide-gray-700 divide-opacity-20">
        {items.length ? (
          items.map((story, idx: number) => (
            <StoryItem
              key={story.id}
              story={story}
              setEditing={setEditing}
              onClickBefore={changePosition(
                story.id,
                'before',
                items[idx - 1]?.id
              )}
              onClickAfter={changePosition(
                story.id,
                'after',
                items[idx + 1]?.id
              )}
            />
          ))
        ) : (
          <div className="p-4 text-center">There are no items to show</div>
        )}
      </div>
    </div>
  )
}
