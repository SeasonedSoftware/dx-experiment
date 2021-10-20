import { stories } from 'stories'
import { getPrisma, clearDatabase } from 'db'

const markStoryDevelopment = stories.markStoryDevelopment

describe('markStoryDevelopment', () => {
  beforeEach(clearDatabase)
  afterAll(async () => {
    await getPrisma().$disconnect()
  })

  it('throws an error if a story is not found', async () => {
    const params = {
      id: 'fbec550d-71a2-4a0f-893e-dadef90424d1',
    }

    expect.assertions(1)
    try {
      await markStoryDevelopment.run(params)
    } catch (e) {
      expect(e.message).toMatch('story_development_story_id_fkey')
      // this string is from a Prisma error message we should probably have our own error here
    }
  })

  it('approves scenario if a valid id is given', async () => {
    const story = await getPrisma().story.create({
      data: { asA: 'user', iWant: 'to', soThat: 'I can test' },
    })

    const params = {
      id: story.id,
    }

    await markStoryDevelopment.run(params)
    expect(
      await getPrisma().storyDevelopment.count({
        where: { storyId: { equals: story.id } },
      })
    ).toBe(1)
  })
})
