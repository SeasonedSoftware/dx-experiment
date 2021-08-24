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
})
