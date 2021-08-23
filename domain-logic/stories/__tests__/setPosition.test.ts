import { stories } from 'stories'
import { getPrisma, clearDatabase } from 'db'

const setPosition = stories.setPosition

describe('setPosition', () => {
  beforeEach(clearDatabase)
  it('throws error if an anchor is not found', async () => {
    const story = await getPrisma().story.create({
      data: { asA: 'user', iWant: 'to', soThat: 'I can test' },
    })

    const params = {
      storyId: story.id,
      storyAnchor: 'fbec550d-71a2-4a0f-893e-dadef90424d1',
      relativePosition: 'after' as const,
    }

    expect.assertions(1)
    try {
      await setPosition.run(params)
    } catch (e) {
      expect(e.message).toMatch('Anchor')
    }
  })

  it('throws error if an story is not found', async () => {
    const anchor = await getPrisma().story.create({
      data: { asA: 'user', iWant: 'to', soThat: 'I can test' },
    })

    const params = {
      storyId: 'fbec550d-71a2-4a0f-893e-dadef90424d1',
      storyAnchor: anchor.id,
      relativePosition: 'after' as const,
    }

    expect.assertions(1)
    try {
      await setPosition.run(params)
    } catch (e) {
      expect(e.message).toMatch('not found')
      // this string is from a Prisma error message we should probably have our own error here
    }
  })

  it('reorder stories when story id is placed after anchor', async () => {
    const story = await getPrisma().story.create({
      data: { asA: 'user', iWant: 'to', soThat: 'I can test', position: 0 },
    })
    const anchor = await getPrisma().story.create({
      data: {
        asA: 'user',
        iWant: 'an anchor',
        soThat: 'I can test',
        position: 1,
      },
    })

    const params = {
      storyId: story.id,
      storyAnchor: anchor.id,
      relativePosition: 'after' as const,
    }
    await setPosition.run(params)

    const orderedIds = await getPrisma().story.findMany({
      select: { id: true },
      orderBy: { position: 'asc' },
    })
    expect(orderedIds).toStrictEqual([{ id: anchor.id }, { id: story.id }])
  })

  it('reorder stories when story id is placed after anchor and before another story', async () => {
    const story = await getPrisma().story.create({
      data: { asA: 'user', iWant: 'to', soThat: 'I can test', position: 0 },
    })
    const anchor = await getPrisma().story.create({
      data: {
        asA: 'user',
        iWant: 'an anchor',
        soThat: 'I can test',
        position: 1,
      },
    })
    const anotherStory = await getPrisma().story.create({
      data: {
        asA: 'user',
        iWant: 'another story',
        soThat: 'I can test',
        position: 2,
      },
    })

    const params = {
      storyId: story.id,
      storyAnchor: anchor.id,
      relativePosition: 'after' as const,
    }
    await setPosition.run(params)

    const orderedIds = await getPrisma().story.findMany({
      select: { id: true },
      orderBy: { position: 'asc' },
    })
    expect(orderedIds).toStrictEqual([
      { id: anchor.id },
      { id: story.id },
      { id: anotherStory.id },
    ])
  })

  it('reorder stories when story id is placed before anchor and after another story', async () => {
    const anotherStory = await getPrisma().story.create({
      data: {
        asA: 'user',
        iWant: 'another story',
        soThat: 'I can test',
        position: -1,
      },
    })
    const anchor = await getPrisma().story.create({
      data: {
        asA: 'user',
        iWant: 'an anchor',
        soThat: 'I can test',
        position: 0,
      },
    })
    const story = await getPrisma().story.create({
      data: { asA: 'user', iWant: 'to', soThat: 'I can test', position: 1 },
    })

    const params = {
      storyId: story.id,
      storyAnchor: anchor.id,
      relativePosition: 'before' as const,
    }
    await setPosition.run(params)

    const orderedIds = await getPrisma().story.findMany({
      select: { id: true },
      orderBy: { position: 'asc' },
    })
    expect(orderedIds).toStrictEqual([
      { id: anotherStory.id },
      { id: story.id },
      { id: anchor.id },
    ])
  })

  it('reorder stories when story id is placed before anchor', async () => {
    const anchor = await getPrisma().story.create({
      data: {
        asA: 'user',
        iWant: 'an anchor',
        soThat: 'I can test',
        position: 0,
      },
    })
    const story = await getPrisma().story.create({
      data: { asA: 'user', iWant: 'to', soThat: 'I can test', position: 1 },
    })

    const params = {
      storyId: story.id,
      storyAnchor: anchor.id,
      relativePosition: 'before' as const,
    }
    await setPosition.run(params)

    const orderedIds = await getPrisma().story.findMany({
      select: { id: true },
      orderBy: { position: 'asc' },
    })
    expect(orderedIds).toStrictEqual([{ id: story.id }, { id: anchor.id }])
  })
})
