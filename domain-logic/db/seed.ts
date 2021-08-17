import { PrismaClient } from '@prisma/client'

import { stories } from './seed-data/stories'

const prisma = new PrismaClient()

async function main() {
  for (let data of stories) {
    await prisma.story.create({ data })
  }
}

main()
  .catch((e: unknown) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
