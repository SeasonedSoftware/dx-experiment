import {
  Scenario as DbScenario,
  Story as DbStory,
  StoryState,
} from '@prisma/client'
import { getPrisma } from '../db'
import { makeAction, exportDomain } from '../prelude'

import {
  createParser,
  updateParser,
  positionParser,
  addScenarioParser,
  storyScenarioParser,
  justAnIdParser,
} from './parsers'

type Story = Omit<DbStory, 'position'>
type Scenario = DbScenario & { approved: boolean }

const { query, mutation } = makeAction.http

const fetchStories = async () => getPrisma().story.findMany()
const fetchScenarios = async (id: string) =>
  (
    await getPrisma().$queryRaw<Scenario[]>`
  SELECT
    s.id,
    s.story_id as "storyId",
    s.description,
    s.created_at as "createdAt",
    EXISTS (SELECT FROM scenario_approval sa WHERE sa.scenario_id = s.id) as approved
  FROM scenario s
  WHERE s.story_id = ${id}`
  ).map(({ id, storyId, description, createdAt, approved }) => ({
    id,
    storyId,
    description,
    createdAt: new Date(createdAt),
    approved,
  }))

const stories = exportDomain('stories', {
  all: query<Story[]>()(fetchStories),
  create: mutation<void, typeof createParser>(createParser)(async (input) => {
    await getPrisma().story.create({ data: input })
  }),
  update: mutation<void, typeof updateParser>(updateParser)(async (input) => {
    await getPrisma().story.update({
      where: { id: input.id },
      data: input,
    })
  }),
  addScenario: mutation<void, typeof addScenarioParser>(addScenarioParser)(
    async (input) => {
      await getPrisma().scenario.create({
        data: input,
      })
    }
  ),
  storyScenarios: query<Scenario[], typeof storyScenarioParser>(
    storyScenarioParser
  )(async (input) => fetchScenarios(input.id)),
  approveScenario: mutation<void, typeof justAnIdParser>(justAnIdParser)(
    async (input) => {
      const scenario = await getPrisma().scenario.findFirst({
        where: { id: input.id },
      })
      if (!scenario) {
        throw new Error(`Scenario ${input.id} not found`)
      }

      const upsertApproval = getPrisma().scenarioApproval.upsert({
        where: { scenarioId: input.id },
        create: { scenarioId: input.id },
        update: {},
      })
      let commands = [upsertApproval]
      const siblingScenarios = (await fetchScenarios(scenario.storyId)).filter(
        (s) => s.id !== input.id
      )
      const pendingScenarios = (await siblingScenarios).filter(
        (s) => !s.approved
      )

      if (pendingScenarios.length === 0) {
        const updateStory = getPrisma().story.update({
          data: { state: StoryState.APPROVED },
          where: { id: scenario.storyId },
        })
        commands.push(updateStory as unknown as any)
      }
      await getPrisma().$transaction(commands)
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

      return fetchStories()
    }
  ),
})

export { stories, StoryState }
export type { Story, Scenario }
