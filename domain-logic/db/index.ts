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

const clearDatabase = async () => {
  const allTables = await getPrisma().$queryRaw(
    "select schemaname, tablename from pg_tables where schemaname NOT IN ('pg_catalog', 'information_schema') AND tablename <> '_prisma_migrations'"
  )
  const truncateCommands = allTables.map((table: any) =>
    getPrisma().$executeRaw(
      `TRUNCATE "${table.schemaname}"."${table.tablename}" CASCADE`
    )
  )
  await getPrisma().$transaction(truncateCommands)
}

export { getPrisma, clearDatabase }
