import { Story as DbStory } from '@prisma/client'
import { getPrisma } from '../db'
import { makeAction, exportDomain } from '../prelude'
import { createParser, updateParser } from './parsers'

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
      orderBy: [{ createdAt: 'desc' }],
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
})

export { stories }
export type { Story }
