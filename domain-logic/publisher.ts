import { PrismaClient } from '@prisma/client'
import merge from 'lodash/merge'

const prisma = new PrismaClient()

const makePrismaPublisher: (prismaClient: PrismaClient, dbChannel: string) => (channel: string, payload: any) => void =
    (prismaClient, dbChannel) =>
        async (channel, payload) =>
            await prismaClient.$executeRaw`SELECT pg_notify(${dbChannel}, ${merge({}, payload, { channel })})`

export { makePrismaPublisher }