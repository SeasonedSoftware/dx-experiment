import { stories } from 'stories'
import { getPrisma, clearDatabase } from 'db'

const storyScenarios = stories.storyScenarios

describe('storyScenarios', () => {
  beforeEach(clearDatabase)
  afterAll(async () => {
    await getPrisma().$disconnect()
  })

  it('shows scenarios that have no approval', async () => {
    const story = await getPrisma().story.create({
      data: { asA: 'user', iWant: 'to', soThat: 'I can test' },
    })
    const scenario = await getPrisma().scenario.create({
      data: { storyId: story.id, description: 'test scenario to be approved' },
    })
    const params = {
      id: scenario.storyId,
    }

    const scenarios = await storyScenarios.run(params)

    expect(scenarios.length).toBe(1)
  })

  it('hides scenario if it has an approval', async () => {
    const story = await getPrisma().story.create({
      data: { asA: 'user', iWant: 'to', soThat: 'I can test' },
    })
    const scenario = await getPrisma().scenario.create({
      data: { storyId: story.id, description: 'test scenario to be approved' },
    })
    await getPrisma().scenarioApproval.create({
      data: { scenarioId: scenario.id },
    })

    const params = {
      id: scenario.storyId,
    }

    const scenarios = await storyScenarios.run(params)

    expect(scenarios.length).toBe(0)
  })
})
