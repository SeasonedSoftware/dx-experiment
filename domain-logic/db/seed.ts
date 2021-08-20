import { PrismaClient } from '@prisma/client'

import { createDummyData } from './dummy-data'
import { createSeedData } from './seed-data'

const prisma = new PrismaClient()

async function main() {
  createSeedData(prisma)
  if (process.env.DX_ENV !== 'development') return

  createDummyData(prisma)
}

main()
  .catch((e: unknown) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
