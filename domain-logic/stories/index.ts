import {
  Scenario as DbScenario,
  ScenarioApproval,
  Story as DbStory,
} from '@prisma/client'
import { getPrisma } from '../db'
import { makeAction, exportDomain } from '../prelude'
import { Prisma } from '@prisma/client'
import {
  createParser,
  updateParser,
  positionParser,
  addScenarioParser,
  storyScenarioParser,
  justAnIdParser,
} from './parsers'

type Story = Omit<DbStory, 'position'>
type Scenario = DbScenario

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
    (
      await getPrisma().$queryRaw<Scenario[]>`
      SELECT
        s.id,
        s.story_id as "storyId",
        s.description,
        s.created_at as "createdAt"
      FROM scenario s
      WHERE NOT EXISTS (SELECT FROM scenario_approval sa WHERE sa.scenario_id = s.id)
      AND s.story_id = ${input.id}`
    ).map(({ id, storyId, description, createdAt }) => ({
      id,
      storyId,
      description,
      createdAt: new Date(createdAt),
    }))
  ),
  approveScenario: mutation<void, typeof justAnIdParser>(justAnIdParser)(
    async (input) => {
      await getPrisma().scenarioApproval.upsert({
        where: { scenarioId: input.id },
        create: { scenarioId: input.id },
        update: {},
      })
    }
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
export type { Story, Scenario }
