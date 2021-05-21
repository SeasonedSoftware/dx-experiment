"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findAction = exports.tasks = exports.error = exports.success = exports.onResult = void 0;
const zod_1 = require("zod");
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const taskCreateParser = zod_1.z.object({ text: zod_1.z.string() });
const taskDeleteParser = zod_1.z.object({ id: zod_1.z.string() });
const taskUpdateParser = zod_1.z.object({
    id: zod_1.z.string(),
    text: zod_1.z.string().optional(),
    completed: zod_1.z.boolean().optional(),
});
const onResult = (onError, onSuccess, r) => r.success ? onSuccess(r.data) : onError(r.errors);
exports.onResult = onResult;
const success = (r) => ({ success: true, data: r });
exports.success = success;
const error = (r) => ({ success: false, errors: r });
exports.error = error;
const httpQuery = (action, parser) => ({
    transport: 'http',
    mutation: false,
    parser,
    action,
});
const httpMutation = (action, parser) => ({
    transport: 'http',
    mutation: true,
    parser,
    action,
});
exports.tasks = {
    post: httpMutation(async (input) => exports.success(await prisma.task.create({ data: input })), taskCreateParser),
    get: httpQuery(async () => exports.success(await prisma.task.findMany())),
    delete: httpMutation(async (input) => exports.success(await prisma.task.delete({
        where: input,
    })), taskDeleteParser),
    put: httpMutation(async (input) => exports.success(await prisma.task.update({
        where: { id: input.id },
        data: input,
    })), taskUpdateParser),
    'send-completed-notifications': httpQuery((input) => {
        console.log({ hello: 'world', superExpensiveOperation: true });
        return exports.success(null);
    }),
    'clear-completed': httpMutation(async () => {
        await prisma.task.deleteMany({
            where: { completed: true },
        });
        return exports.success(prisma.task.findMany());
    }),
};
const rules = { tasks: exports.tasks };
const findActionInDomain = (rules) => (namespace, actionName) => rules[namespace]?.[actionName];
exports.findAction = findActionInDomain(rules);
exports.default = rules;
