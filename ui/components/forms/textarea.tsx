import { forwardRef } from 'react'

type Props = React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label?: string
  error?: { message?: string }
}
const TextArea = forwardRef<HTMLTextAreaElement, Props>(
  ({ error, label, name, id = name, ...props }, ref) => (
    <div>
      {label && <label className="block px-4 pt-2" htmlFor={id}>{label}</label>}
      <textarea
        ref={ref}
        id={id}
        name={name}
        {...props}
        className="p-4 pt-2 text-lg w-full dark:bg-gray-800 dark:placeholder-gray-600"
      />
      {error?.message && (
        <p className="text-center p-1 bg-red-300 text-red-800">
          {error.message}
        </p>
      )}
    </div>
  )
)

export { TextArea }
