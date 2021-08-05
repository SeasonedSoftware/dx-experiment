import { Story } from '@prisma/client'

export default function StoryItem({ asA, iWant, soThat, createdAt }: Story) {
  return (
    <details className="w-full cursor-pointer">
      <summary className="text-xl p-4 py-3 font-semibold">
        {iWant.substring(0, 1).toUpperCase() + iWant.substring(1)}
      </summary>
      <div className="p-4 py-3 mt-2 mb-4">
        <p>
          As a <strong>{asA}</strong> I want to <strong>{iWant}</strong> So that{' '}
          <strong>{soThat}</strong>.
        </p>
        <p className="mt-2 text-xs text-right font-semibold dark:text-white dark:text-opacity-50">
          {new Date(createdAt)?.toLocaleDateString()}
        </p>
      </div>
    </details>
  )
}
