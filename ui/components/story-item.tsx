import { Story } from '@prisma/client'

type Props = {
  story: Story
  setEditing: (a: string | null) => void
}
export default function StoryItem({ story, setEditing }: Props) {
  return (
    <details className="w-full cursor-pointer">
      <summary className="text-xl p-4 py-3 font-semibold">
        {story.iWant.substring(0, 1).toUpperCase() + story.iWant.substring(1)}
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
          {new Date(story.createdAt)?.toLocaleDateString()}
        </p>
      </div>
    </details>
  )
}
