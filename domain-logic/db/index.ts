import { PrismaClient } from '@prisma/client'
import { serverOrBrowser } from '../prelude'

declare module NodeJS {
  interface Global {
    prisma: PrismaClient
  }
}

declare const global: NodeJS.Global

const getPrisma = () =>
  serverOrBrowser(
    () => {
      const prisma = global.prisma ?? new PrismaClient()
      if (process.env.NODE_ENV === 'development') global.prisma = prisma
      return prisma
    },
    () => {
      throw new Error('Prisma can only be used in the server')
    }
  )

export { getPrisma }
