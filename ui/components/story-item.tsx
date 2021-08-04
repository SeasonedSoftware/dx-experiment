import { useState } from 'react'
import { Story } from '@prisma/client'

export default function StoryItem({ asA, iWant, soThat, createdAt }: Story) {
  const [open, setOpen] = useState(false)

  return (
    <div
      className="w-full p-4 py-3 cursor-pointer"
      onClick={() => setOpen(!open)}
    >
      <span className="text-xl font-semibold">
        {iWant.substring(0, 1).toUpperCase() + iWant.substring(1)}
      </span>
      {open && (
        <>
          <p className="mt-2">
            As a <strong>{asA}</strong> I want to <strong>{iWant}</strong> So that{' '}
            <strong>{soThat}</strong>.
          </p>
          <p className="mb-4">{createdAt.toLocaleDateString && createdAt.toLocaleDateString()}</p>
        </>
      )}
    </div>
  )
}
