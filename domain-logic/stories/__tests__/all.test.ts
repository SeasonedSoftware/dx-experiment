import { stories as storiesActions } from 'stories'
import { getPrisma, clearDatabase } from 'db'

const all = storiesActions.all

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

    expect(stories[0].state).toBe('pending')
  })

  it('show one story pending when there is one scenario without approval', async () => {
    const story = await getPrisma().story.create({
      data: { asA: 'user', iWant: 'to', soThat: 'I can test' },
    })
    await getPrisma().scenario.create({
      data: { storyId: story.id, description: 'test scenario to be approved' },
    })

    const stories = await all.run()

    expect(stories[0].state).toBe('pending')
  })

  it('show one story approved when there are only approved scenarios', async () => {
    const story = await getPrisma().story.create({
      data: { asA: 'user', iWant: 'to', soThat: 'I can test' },
    })
    const scenario = await getPrisma().scenario.create({
      data: { storyId: story.id, description: 'test scenario to be approved' },
    })
    await getPrisma().scenarioApproval.create({
      data: { scenarioId: scenario.id },
    })

    const stories = await all.run()

    expect(stories[0].state).toBe('approved')
  })

  it('show one story approved when story is marked as ready and there are only approved scenarios', async () => {
    const story = await getPrisma().story.create({
      data: { asA: 'user', iWant: 'to', soThat: 'I can test' },
    })
    const scenario = await getPrisma().scenario.create({
      data: {
        storyId: story.id,
        description: 'test scenario to be approved',
      },
    })
    await getPrisma().scenarioApproval.create({
      data: { scenarioId: scenario.id },
    })
    await getPrisma().storyReady.create({
      data: { storyId: story.id },
    })

    const stories = await all.run()

    expect(stories[0].state).toBe('approved')
  })
})
