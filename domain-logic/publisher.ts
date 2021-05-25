import { PrismaClient } from '@prisma/client'
import merge from 'lodash/merge'

const prisma = new PrismaClient()

const makePrismaPublisher: (prismaClient: PrismaClient, dbChannel: string) => (namespace: string) => (actionName: string, payload: any) => void =
    (prismaClient, dbChannel) =>
        (namespace) =>
            async (actionName, payload) =>
                await prismaClient.$executeRaw`SELECT pg_notify(${dbChannel}, ${merge({}, { payload, channel: `${actionName}@${namespace}` })})`

export { makePrismaPublisher }