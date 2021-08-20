import { PrismaClient } from '@prisma/client'
import { stories } from './stories'

async function createDummyData(prisma: PrismaClient) {
  for (let data of stories) {
    await prisma.story.create({ data })
  }
}

export { createDummyData }
