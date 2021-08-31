import { Scenario, Story as DbStory } from '@prisma/client'
import { getPrisma } from '../db'
import { makeAction, exportDomain } from '../prelude'
import {
  createParser,
  updateParser,
  positionParser,
  addScenarioParser,
  storyScenarioParser,
} from './parsers'

type Story = Omit<DbStory, 'position'>

const { query, mutation } = makeAction.http

const visibleAttributes = {
  id: true,
  asA: true,
  iWant: true,
  soThat: true,
  createdAt: true,
}

const stories = exportDomain('stories', {
  all: query<Story[]>()(async () =>
    getPrisma().story.findMany({
      select: visibleAttributes,
      orderBy: [{ position: 'asc' }],
    })
  ),
  create: mutation<Story, typeof createParser>(createParser)(async (input) =>
    getPrisma().story.create({ select: visibleAttributes, data: input })
  ),
  update: mutation<Story, typeof updateParser>(updateParser)(async (input) =>
    getPrisma().story.update({
      select: visibleAttributes,
      where: { id: input.id },
      data: input,
    })
  ),
  addScenario: mutation<void, typeof addScenarioParser>(addScenarioParser)(
    async (input) => {
      await getPrisma().scenario.create({
        data: input,
      })
    }
  ),
  storyScenarios: query<Scenario[], typeof storyScenarioParser>(
    storyScenarioParser
  )(async (input) =>
    getPrisma().scenario.findMany({ where: { storyId: input.id } })
  ),
  setPosition: mutation<Story[], typeof positionParser>(positionParser)(
    async (input) => {
      const anchor = await getPrisma().story.findFirst({
        where: { id: input.storyAnchor },
      })

      if (!anchor) {
        throw new Error(`Anchor ${input.storyAnchor} not found`)
      }

      let position = null
      if (input.relativePosition === 'after') {
        const afterAnchor = await getPrisma().story.findFirst({
          orderBy: { position: 'asc' },
          where: { position: { gt: anchor.position } },
          take: 1,
        })

        position =
          anchor.position +
          (afterAnchor?.position
            ? (afterAnchor.position - anchor.position) / 2
            : 1)
      } else {
        const beforeAnchor = await getPrisma().story.findFirst({
          orderBy: { position: 'desc' },
          where: { position: { lt: anchor.position } },
          take: 1,
        })

        position =
          anchor.position -
          (beforeAnchor?.position
            ? (anchor.position - beforeAnchor.position) / 2
            : 1)
      }
      await getPrisma().story.update({
        where: { id: input.storyId },
        data: { position },
      })

      return getPrisma().story.findMany({ orderBy: { position: 'asc' } })
    }
  ),
})

export { stories }
export type { Story }
export type { Scenario } from '@prisma/client'
