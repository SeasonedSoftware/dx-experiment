import { PrismaClient } from '@prisma/client'
import merge from 'lodash/merge'

const makePrismaPublisher =
  (prismaClient: PrismaClient, dbChannel: string) =>
  (namespace: string) =>
  async (actionName: string, payload: any): Promise<void> => {
    await prismaClient.$executeRaw`SELECT pg_notify(${dbChannel}, ${merge(
      {},
      { payload, channel: `${actionName}@${namespace}` },
    )})`
  }

export { makePrismaPublisher }
