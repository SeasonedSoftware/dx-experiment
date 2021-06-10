import { useEffect, useRef, useState } from 'react'
import { useClickOutside } from 'lib/hooks'
import { cx } from 'lib/utils'
import { Task } from 'domain-logic/resources/task'

interface IProps {
  task: Task
  update(t: Partial<Task>): void
  destroy(): void
}

export default function ListItem({ task, update, destroy }: IProps) {
  const [editing, setEditing] = useState(false)
  const wrapperRef = useRef(null)

  const [text, setText] = useState(task.text)
  const [completed, setCompleted] = useState(task.completed)
  useEffect(() => {
    setText(task.text)
  }, [task.text])
  useEffect(() => {
    setCompleted(task.completed)
  }, [task.completed])

  const saveText = (text: string) => {
    update({ text })
    setEditing(false)
  }

  useClickOutside({
    ref: wrapperRef,
    enabled: editing,
    callback: () => saveText(text),
  })
  return (
    <li
      key={task.id}
      className={cx(
        'group relative text-2xl flex ring-inset ring-red-400 dark:ring-green-500',
        editing || 'focus-within:ring-1',
        completed && 'completed',
      )}
      ref={wrapperRef}
    >
      <div className={cx('flex items-center w-full', editing || 'check-bg')}>
        <input
          className={cx(
            'absolute opacity-0 h-full top-0 w-12 left-0 z-20',
            editing && 'hidden',
          )}
          type="checkbox"
          checked={!!task.completed}
          onChange={({ currentTarget }) => {
            const completed = currentTarget.checked
            setCompleted(completed)
            update({ completed })
          }}
          autoFocus={editing}
        />
        <label
          className={cx(
            task.completed
              ? 'text-gray-400 dark:text-gray-600 line-through'
              : 'text-gray-600 dark:text-gray-300',
            'flex w-full pl-14 pr-2 py-4',
          )}
          onDoubleClick={({ currentTarget }) => {
            setEditing(true)
            currentTarget.focus()
          }}
        >
          {text}
        </label>
        <button
          className="group-hover:block absolute hidden w-8 h-8 z-20 right-4 font-mono text-red-600 dark:text-green-500 dark:text-opacity-50 text-opacity-40"
          onClick={() => destroy()}
        >
          x
        </button>
      </div>
      <div
        className={cx(
          editing ? 'block' : 'hidden',
          'absolute inset-0 z-30 left-10 shadow-inner',
        )}
      >
        <input
          className="w-full h-full px-4 ring-1 ring-inset ring-gray-200 outline-none shadow-sm"
          value={text}
          onChange={({ currentTarget }) => {
            const { value } = currentTarget
            setText(value)
          }}
          onKeyPress={({ key }) => {
            if (key === 'Enter') saveText(text)
          }}
        />
      </div>
    </li>
  )
}
