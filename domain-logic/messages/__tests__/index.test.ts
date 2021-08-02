import { messages } from '../index'

describe('hello', () => {
  it('returns a hard-coded message', async () => {
    expect(await messages.hello.run()).toBe('Hello')
  })
})
