import { Scenario as DbScenario, Story as DbStory } from '@prisma/client'
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

type StoryState = 'pending' | 'ready' | 'approved'
type Story = Omit<DbStory, 'position'> & { state: StoryState }
type Scenario = DbScenario & { approved: boolean }

const { query, mutation } = makeAction.http

const fetchStories = async () =>
  (
    await getPrisma().$queryRaw<Story[]>`
    SELECT
      s.id,
      as_a as "asA",
      i_want as "iWant",
      so_that as "soThat",
      created_at as "createdAt",
      CASE
        WHEN EXISTS (SELECT FROM story_ready sr WHERE sr.story_id = s.id) THEN 'ready'
        WHEN (
          SELECT coalesce(bool_and(sa.id IS NOT NULL), false)
          FROM scenario sc
          LEFT JOIN scenario_approval sa ON sa.scenario_id = sc.id
          WHERE sc.story_id = s.id
        ) THEN 'approved'
        ELSE 'pending'
      END as state
    FROM story s
    ORDER BY position ASC`
  ).map(({ id, asA, iWant, soThat, createdAt, state }) => ({
    id,
    asA,
    iWant,
    soThat,
    createdAt: new Date(createdAt),
    state,
  }))

const fetchScenarios = async ({ id }: { id: string }) =>
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
  )(fetchScenarios),

  approveScenario: mutation<void, typeof justAnIdParser>(justAnIdParser)(
    async (input) => {
      await getPrisma().scenarioApproval.upsert({
        where: { scenarioId: input.id },
        create: { scenarioId: input.id },
        update: {},
      })
    }
  ),

  markStoryReady: mutation<void, typeof justAnIdParser>(justAnIdParser)(
    async (input) => {
      await getPrisma().storyReady.upsert({
        where: { storyId: input.id },
        create: { storyId: input.id },
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

      return fetchStories()
    }
  ),
})

export { stories }
export type { Story, Scenario }
