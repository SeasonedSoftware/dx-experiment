import { cx } from '../utils'

describe('cx', () => {
  it('returns empty string for no parameters', () => {
    expect(cx()).toBe('')
  })
})
