import { cx } from '../utils'

describe('cx', () => {
  it('returns empty string for no parameters', () => {
    expect(cx()).toBe('')
  })
  it('returns a string to be used as html classNames', () => {
    expect(cx('base', 'another', 'yet-another class')).toBe(
      'base another yet-another class'
    )
  })

  it('filters out nil values', () => {
    expect(cx('base', undefined, null, 'another')).toBe('base another')
  })

  it('filters out booleans accepting ternary, && and || operators', () => {
    const yup = true
    const no = false
    expect(
      cx(
        'base',
        yup ? 'valid' : 'invalid',
        yup && 'yes',
        yup || 'no',
        no || 'appear'
      )
    ).toBe('base valid yes appear')
  })
})
