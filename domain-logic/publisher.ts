import { PrismaClient } from '@prisma/client'
import merge from 'lodash/merge'

const prisma = new PrismaClient()

const makePrismaPublisher: (prismaClient: PrismaClient, dbChannel: string) => (channel: string) => (actionName: string, payload: any) => void =
    (prismaClient, dbChannel) =>
        (channel) =>
            async (actionName, payload) =>
                await prismaClient.$executeRaw`SELECT pg_notify(${dbChannel}, ${merge({}, { payload, channel: `${channel}/${actionName}` })})`

export { makePrismaPublisher }