import { stories } from 'stories'
import { getPrisma, clearDatabase } from 'db'
import { StoryState } from '@prisma/client'

const all = stories.all

describe('all', () => {
  beforeEach(clearDatabase)
  afterAll(async () => {
    await getPrisma().$disconnect()
  })

  it('show one story pending when there are no scenarios', async () => {
    const story = await getPrisma().story.create({
      data: { asA: 'user', iWant: 'to', soThat: 'I can test' },
    })

    const stories = await all.run()

    expect(stories[0].state).toBe(StoryState.PENDING)
  })
})
