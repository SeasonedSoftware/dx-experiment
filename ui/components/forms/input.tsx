import { cx } from '@/lib/utils'
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
        className={cx("p-4 text-lg w-full dark:bg-gray-800 dark:placeholder-gray-600", props.className)}
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
