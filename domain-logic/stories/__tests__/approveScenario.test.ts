import { stories } from 'stories'
import { getPrisma, clearDatabase } from 'db'

const approveScenario = stories.approveScenario

describe('approveScenario', () => {
  beforeEach(clearDatabase)
  afterAll(async () => {
    await getPrisma().$disconnect()
  })

  it('throws an error if a scenario is not found', async () => {
    const params = {
      id: 'fbec550d-71a2-4a0f-893e-dadef90424d1',
    }

    expect.assertions(1)
    try {
      await approveScenario.run(params)
    } catch (e) {
      expect(e.message).toMatch('scenario_approval_scenario_id_fkey')
      // this string is from a Prisma error message we should probably have our own error here
    }
  })

  it('approves scenario if a valid id is given', async () => {
    const story = await getPrisma().story.create({
      data: { asA: 'user', iWant: 'to', soThat: 'I can test' },
    })
    const scenario = await getPrisma().scenario.create({
      data: { storyId: story.id, description: 'test scenario to be approved' },
    })

    const params = {
      id: scenario.id,
    }

    await approveScenario.run(params)
    expect(
      await getPrisma().scenarioApproval.count({
        where: { scenarioId: { equals: scenario.id } },
      })
    ).toBe(1)
  })
})
