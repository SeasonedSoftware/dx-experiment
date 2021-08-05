import { forwardRef } from 'react'

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  error?: { message?: string }
}
const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ error, ...props }, ref) => (
    <>
      <input
        ref={ref}
        {...props}
        className="p-4 text-2xl w-full dark:bg-gray-800 dark:border-b border-gray-600 dark:placeholder-gray-600"
      />
      {error?.message && (
        <p className="text-center p-1 bg-red-300 text-red-800">
          {error.message}
        </p>
      )}
    </>
  )
)

export { Input }
