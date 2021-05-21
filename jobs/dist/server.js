"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Require the framework and instantiate it
const fastify_1 = __importDefault(require("fastify"));
const fastify_postgres_1 = __importDefault(require("fastify-postgres"));
const pg_listen_1 = __importDefault(require("pg-listen"));
const domain_logic_1 = __importDefault(require("domain-logic"));
console.log("TEST", domain_logic_1.default);
const databaseURL = 'postgres://postgres@localhost/postgres';
// Accepts the same connection config object that the "pg" package would take
const subscriber = pg_listen_1.default({ connectionString: databaseURL });
subscriber.notifications.on("my-channel", (payload) => {
    // Payload as passed to subscriber.notify() (see below)
    console.log("Received notification in 'my-channel':", payload);
});
subscriber.events.on("error", (error) => {
    console.error("Fatal database connection error:", error);
    process.exit(1);
});
process.on("exit", () => {
    console.log('Closing database notificationlistener...');
    subscriber.close();
    console.log('closed');
});
const connectPgListener = async () => {
    await subscriber.connect();
    await subscriber.listenTo("my-channel");
};
const server = fastify_1.default({ logger: true });
server.register(fastify_postgres_1.default, {
    connectionString: databaseURL
});
// Declare a route
server.get('/health', async (request, reply) => {
    const client = await server.pg.connect();
    const { rows } = await client.query('SELECT version()', []);
    client.release();
    return { db: rows };
});
// Run the server!
const start = async () => {
    try {
        await server.listen(3001);
        server.log.info(`server listening on ${server.server.address().port}`);
    }
    catch (err) {
        server.log.error(err);
        process.exit(1);
    }
};
console.log('Connecting database listener...');
connectPgListener();
console.log('Starting http interface...');
start();
console.log('Server is running');
