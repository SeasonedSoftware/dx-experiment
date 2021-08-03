import { z } from 'zod'
import { Story } from '@prisma/client'
import { getPrisma } from '../db'
import { makeAction, exportDomain } from '../prelude'

const { query, mutation } = makeAction.http

const createParser = z.object({
  asA: z.string(),
  iWant: z.string(),
  soThat: z.string(),
})

const stories = exportDomain('stories', {
  all: query<Story[]>()(async () => getPrisma().story.findMany()),
  create: mutation<Story, typeof createParser>(createParser)(async (input) =>
    getPrisma().story.create({ data: input })
  ),
})

export { stories }
