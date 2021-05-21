import { useEffect, useRef, useState } from 'react'
import { useClickOutside } from 'lib/hooks'
import { clsx } from 'lib/utils'
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
      className={clsx([editing && 'editing', completed && 'completed'])}
      ref={wrapperRef}
    >
      <div className="view">
        <input
          className="toggle"
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
          onDoubleClick={({ currentTarget }) => {
            setEditing(true)
            currentTarget.focus()
          }}
        >
          {text}
        </label>
        <button className="destroy" onClick={() => destroy()} />
      </div>
      <input
        className="edit"
        value={text}
        onChange={({ currentTarget }) => {
          const { value } = currentTarget
          setText(value)
        }}
        onKeyPress={({ key }) => {
          if (key === 'Enter') saveText(text)
        }}
      />
    </li>
  )
}
