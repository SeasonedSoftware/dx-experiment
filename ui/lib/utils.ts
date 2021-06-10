import { compose, reject, isNil, isBoolean, flatten, join } from 'lodash/fp'

export const cx = (...args: unknown[]) =>
  compose(join(' '), reject(isBoolean), reject(isNil), flatten)(args)
