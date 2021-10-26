import { ArrowUpIcon, ArrowDownIcon } from '@heroicons/react/outline'
import { Story, stories } from 'domain-logic/stories'
import { mutate } from 'swr'
import Scenarios from './scenarios'
import { useRef, useState } from 'react'
import type { MutatorCallback } from 'swr/dist/types'

type Props = {
  story: Story
  setEditing: (a: string | null) => void
  onClickBefore: React.MouseEventHandler
  onClickAfter: React.MouseEventHandler
}
export default function StoryItem({
  story,
  setEditing,
  onClickBefore,
  onClickAfter,
}: Props) {
  const [isOpen, setIsOpen] = useState(false)
  const ref = useRef<HTMLDetailsElement>(null)

  const toggleHandler = (ev: React.MouseEvent<HTMLDetailsElement>) => {
    setTimeout(() => {
      setIsOpen(Boolean(ref.current?.open))
    }, 1)
  }

  return (
    <details
      ref={ref}
      onClick={toggleHandler}
      className="w-full cursor-pointer group"
    >
      <summary className="flex items-start justify-between p-4 py-3 text-xl font-semibold">
        <span className="capitalize-first">{story.iWant}</span>
        <div className="flex border divide-x rounded">
          <button
            type="button"
            className="p-2 group-first:hidden"
            onClick={onClickBefore}
            aria-label="Mover para cima"
          >
            <ArrowUpIcon className="w-3 h-3" />
          </button>
          <button
            type="button"
            className="p-2 group-last:hidden"
            onClick={onClickAfter}
            aria-label="Mover para baixo"
          >
            <ArrowDownIcon className="w-3 h-3" />
          </button>
        </div>
      </summary>
      <div
        onDoubleClick={() => setEditing(story.id)}
        className="p-4 py-3 mt-2 mb-4"
      >
        <p>
          As a <strong>{story.asA}</strong> I want to{' '}
          <strong>{story.iWant}</strong> So that <strong>{story.soThat}</strong>
          .
        </p>
        <p className="mt-2 text-xs font-semibold text-right text-gray-900 text-opacity-60 dark:text-white dark:text-opacity-50">
          {story.createdAt.toLocaleDateString()}
        </p>
      </div>
      {isOpen && <Scenarios story={story} />}
      {story.state === 'pending' && (
        <div className="flex flex-col p-4">
          <button
            onClick={async () => {
              await stories.markStoryReady.run({ id: story.id })
              mutate('stories')
            }}
            className="p-2 transition-all bg-green-500 rounded hover:bg-green-600"
          >
            mark as ready to start
          </button>
        </div>
      )}
      {story.state === 'ready' && (
        <div className="flex flex-col p-4">
          <button
            onClick={async () => {
              await stories.markStoryDevelopment.run({ id: story.id })
              mutate('stories')
            }}
            className="p-2 transition-all bg-green-500 rounded hover:bg-green-600"
          >
            start development
          </button>
        </div>
      )}
    </details>
  )
}
