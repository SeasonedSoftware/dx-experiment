import { Task } from 'domain-logic/resources/task'

export default function Form({ addTask }: { addTask(t: Partial<Task>): void }) {
  return (
    <header className="header">
      <h1>todos</h1>
      <input
        className="new-todo"
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
    </header>
  )
}
