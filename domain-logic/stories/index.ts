import { Story } from '@prisma/client'
import { getPrisma } from '../db'
import { makeAction, exportDomain } from '../prelude'
import { createParser, updateParser } from './parsers'

const { query, mutation } = makeAction.http

const stories = exportDomain('stories', {
  all: query<Story[]>()(async () =>
    getPrisma().story.findMany({ orderBy: [{ createdAt: 'desc' }] })
  ),
  create: mutation<Story, typeof createParser>(createParser)(async (input) =>
    getPrisma().story.create({ data: input })
  ),
  update: mutation<Story, typeof updateParser>(updateParser)(async (input) =>
    getPrisma().story.update({ where: { id: input.id }, data: input })
  ),
})

export { stories }
