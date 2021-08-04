import { forwardRef } from 'react'

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  errors: any
}
const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ errors, ...props }, ref) => (
    <>
      <input
        ref={ref}
        {...props}
        className="p-4 text-2xl w-full dark:bg-gray-800 dark:border-b border-gray-600 dark:placeholder-gray-600"
      />
      {errors[props.name!]?.message && (
        <p className="text-red-600">{errors[props.name!]?.message}</p>
      )}
    </>
  )
)

export { Input }
