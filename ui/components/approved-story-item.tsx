import { Story, stories } from 'domain-logic/stories'
import Scenarios from './scenarios'
import { useRef, useState } from 'react'

type Props = {
  story: Story
}
export default function StoryItem({ story }: Props) {
  const [isOpen, setIsOpen] = useState(false)
  const ref = useRef<HTMLDetailsElement>(null)

  const swrKey = `scenarios-${story.id}`

  const toggleHandler = (ev: React.MouseEvent<HTMLDetailsElement>) => {
    setTimeout(() => {
      setIsOpen(Boolean(ref.current?.open))
    }, 1)
  }

  return (
    <details
      ref={ref}
      onClick={toggleHandler}
      className="group w-full cursor-pointer"
    >
      <summary className="flex items-start justify-between text-xl p-4 py-3 font-semibold">
        <span className="capitalize-first">{story.iWant}</span>
        <div className="flex border rounded divide-x"></div>
      </summary>
      <div className="p-4 py-3 mt-2 mb-4">
        <p>
          As a <strong>{story.asA}</strong> I want to{' '}
          <strong>{story.iWant}</strong> So that <strong>{story.soThat}</strong>
          .
        </p>
        <p className="mt-2 text-xs text-right font-semibold text-gray-900 text-opacity-60 dark:text-white dark:text-opacity-50">
          {story.createdAt.toLocaleDateString()}
        </p>
      </div>
      {isOpen && (
        <>
          <Scenarios story={story} mutateStories={undefined} />
        </>
      )}
    </details>
  )
}
