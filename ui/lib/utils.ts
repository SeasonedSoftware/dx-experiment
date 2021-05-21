import { compose, join, reject, isNil } from 'lodash/fp'

export const clsx = compose(join(' '), reject(isNil))
