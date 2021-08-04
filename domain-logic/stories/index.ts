import { Story } from '@prisma/client'
import { getPrisma } from '../db'
import { makeAction, exportDomain } from '../prelude'
import { storyCreateParser } from './parsers'

const { query, mutation } = makeAction.http

const stories = exportDomain('stories', {
  all: query<Story[]>()(async () =>
    getPrisma().story.findMany({ orderBy: [{ createdAt: 'desc' }] })
  ),
  create: mutation<Story, typeof storyCreateParser>(storyCreateParser)(
    async (input) => getPrisma().story.create({ data: input })
  ),
})

export { stories }
