import { ArrowUpIcon, ArrowDownIcon } from '@heroicons/react/outline'
import { Story } from 'domain-logic/stories'

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
  return (
    <details className="group w-full cursor-pointer">
      <summary className="flex justify-between text-xl p-4 py-3 font-semibold">
        <span className="capitalize-first">{story.iWant}</span>
        <div className="flex border rounded divide-x">
          <button
            type="button"
            className="px-2 group-first:hidden"
            onClick={onClickBefore}
            aria-label="Mover para cima"
          >
            <ArrowUpIcon className="w-3 h-3" />
          </button>
          <button
            type="button"
            className="px-2 group-last:hidden"
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
        <p className="mt-2 text-xs text-right font-semibold text-gray-900 text-opacity-60 dark:text-white dark:text-opacity-50">
          {story.createdAt.toLocaleDateString()}
        </p>
      </div>
    </details>
  )
}
