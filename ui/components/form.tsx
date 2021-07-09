import { Task } from 'domain-logic'

export default function Form({ addTask }: { addTask(t: Partial<Task>): void }) {
  return (
    <header className="relative">
      <input
        className="p-4 pl-14 text-2xl w-full dark:bg-gray-800 dark:border-b border-gray-600 dark:placeholder-gray-600"
        placeholder="What needs to be done?"
        autoFocus
        onKeyDown={({ currentTarget, key }) => {
          const text = currentTarget.value.trim()
          if (key === 'Enter' && text) {
            addTask({ text })
            currentTarget.value = ''
          }
        }}
      />
      <div className="absolute w-12 flex items-center justify-center top-0 bottom-0 left-0 z-10 focus-within:ring-1 ring-red-400 dark:ring-green-500">
        <input id="toggle-all" className="absolute opacity-0" type="checkbox" />
        <label
          className="absolte flex items-center justify-center w-full h-full text-2xl rotate-90 text-gray-500 dark:text-gray-600"
          htmlFor="toggle-all"
          title="Mark all as complete"
        >
          ❯
        </label>
      </div>
    </header>
  )
}
