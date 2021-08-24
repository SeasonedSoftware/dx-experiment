import { stories } from 'stories'
import { getPrisma, clearDatabase } from 'db'

const addScenario = stories.addScenario

describe('addScenario', () => {
  beforeEach(clearDatabase)
  afterAll(async () => {
    await getPrisma().$disconnect()
  })

  it('throws error if an story is not found', async () => {
    const params = {
      storyId: 'fbec550d-71a2-4a0f-893e-dadef90424d1',
      description: 'some scenario',
    }

    expect.assertions(1)
    try {
      await addScenario.run(params)
    } catch (e) {
      expect(e.message).toMatch('scenario_story_id_fkey')
      // this string is from a Prisma error message we should probably have our own error here
    }
  })

  it('creates scenario if story and description are given', async () => {
    const story = await getPrisma().story.create({
      data: { asA: 'user', iWant: 'to', soThat: 'I can test' },
    })
    const params = {
      storyId: story.id,
      description: 'some scenario',
    }

    await addScenario.run(params)
    expect(
      await getPrisma().scenario.count({
        where: { storyId: { equals: story.id } },
      })
    ).toBe(1)
  })
})
