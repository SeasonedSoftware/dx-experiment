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
      global.prisma = global.prisma ?? new PrismaClient()
      return global.prisma
    },
    () => {
      throw new Error('Prisma can only be used in the server')
    }
  )

export { getPrisma }
