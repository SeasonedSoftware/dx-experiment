import { z } from 'zod'
import { Prisma, PrismaClient } from '@prisma/client'
import { makeAction, publishInNamespace, Actions, success, empty } from '../prelude'

const prisma = new PrismaClient()

const taskCreateParser = z.object({ text: z.string() })
const taskDeleteParser = z.object({ id: z.string() })
const taskUpdateParser = z.object({
    id: z.string(),
    text: z.string().optional(),
    completed: z.boolean().optional(),
})

const { query, mutation } = makeAction.http
const { mutation: notifyMutation } = makeAction.notification
const { mutation: timerMutation } = makeAction.timer

const publish = publishInNamespace('tasks')

const tasks: Actions = {
    post: mutation(
        async (input: z.infer<typeof taskCreateParser>) =>
            success(await prisma.task.create({ data: input })),
        taskCreateParser,
    ),
    get: query(async () => success(await prisma.task.findMany())),
    delete: mutation(
        async (input: z.infer<typeof taskDeleteParser>) =>
            success(
                await prisma.task.delete({
                    where: input,
                }),
            ),
        taskDeleteParser,
    ),
    put: mutation(
        async (input: z.infer<typeof taskUpdateParser>) =>
            success(
                await prisma.task.update({
                    where: { id: input.id },
                    data: input,
                }),
            ),
        taskUpdateParser,
    ),
    'send-completed-notifications': query((input: any) => {
        const payload = { hello: 'world', superExpensiveOperation: true }
        console.log({ payload })
        publish('deliver-completed-notifications', payload)
        return empty()
    }),
    'deliver-completed-notifications': notifyMutation((input: any) => {
        console.log('deliver-completed-notifications event handler received: ', { input })
        return empty()
    }),
    'deliver-reminder-notifications': timerMutation((input: any) => {
        console.log('deliver-reminder-notifications event handler received: ', { input })
        return empty()
    }),

    'clear-completed': mutation(async () => {
        await prisma.task.deleteMany({
            where: { completed: true },
        })
        return success(prisma.task.findMany())
    }),
}

type Task = Prisma.TaskCreateInput

export { Task, tasks }