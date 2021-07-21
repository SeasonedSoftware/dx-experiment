import { z } from "zod";
import { Prisma, PrismaClient } from "@prisma/client";
import { publishInNamespace, success, empty, makeDomain } from "../prelude";

const prisma = new PrismaClient();

const taskCreateParser = z.object({ text: z.string() });
const taskDeleteParser = z.object({ id: z.string() });
const taskUpdateParser = z.object({
  id: z.string(),
  text: z.string().optional(),
  completed: z.boolean().optional(),
});

const publish = publishInNamespace("tasks");

const t = makeDomain("tasks");

t.addMutation("http", "post")(taskCreateParser)(
  async (input: z.infer<typeof taskCreateParser>) =>
    success(await prisma.task.create({ data: input }))
);

t.addQuery("http", "get")()(async () => success(await prisma.task.findMany()));

t.addMutation("http", "delete")(taskDeleteParser)(
  async (input: z.infer<typeof taskDeleteParser>) =>
    success(
      await prisma.task.delete({
        where: input,
      })
    )
);

t.addMutation("http", "put")(taskUpdateParser)(
  async (input: z.infer<typeof taskUpdateParser>) =>
    success(
      await prisma.task.update({
        where: { id: input.id },
        data: input,
      })
    )
);

t.addQuery("http", "send-completed-notifications")()(() => {
  const payload = { hello: "world", superExpensiveOperation: true };
  console.log({ payload });
  publish("deliver-completed-notifications", payload);
  return empty();
});

t.addMutation("notification", "deliver-completed-notifications")()(
  (input: any) => {
    console.log("deliver-completed-notifications event handler received: ", {
      input,
    });
    return empty();
  }
);

t.addMutation("timer", "deliver-reminder-notifications")()(
  async (input: any) => {
    console.log("deliver-reminder-notifications event handler received: ", {
      input,
    });
    return empty();
  }
);

const tasks = t.actions();

type Task = Prisma.TaskCreateInput;

export { Task, tasks };
