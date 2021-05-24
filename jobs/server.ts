// Require the framework and instantiate it
import fastify from 'fastify'
import fastifyPostgres from 'fastify-postgres'
import createSubscriber from 'pg-listen'
import rules from 'domain-logic'
import { AddressInfo } from 'net'
import { exit } from 'process'
import dotenv from 'dotenv'
import { onResult, Action, findAction } from 'domain-logic'
import isNil from 'lodash/isNil'

const result = dotenv.config()

if (result.error) {
  throw result.error
}

console.log("Running with environment loaded from .env: ", result.parsed)

if (process.env.CHANNEL === undefined) {
  console.error("Please provide a value for CHANNEL environment variable")
  console.log({ DATABASE_URL: process.env.CHANNEL })
  exit(1)
}

if (process.env.DATABASE_URL === undefined) {
  console.error("Please provide a value for DATABASE_URL environment variable")
  console.log({ DATABASE_URL: process.env.DATABASE_URL })
  exit(1)
}

const databaseURL = process.env.DATABASE_URL as string
const channel = process.env.CHANNEL as string

// Accepts the same connection config object that the "pg" package would take
const subscriber = createSubscriber({ connectionString: databaseURL })

subscriber.notifications.on(channel, async (payload) => {
  // Payload as passed to subscriber.notify() (see below)
  console.log(`Received notification in '${channel}':`, payload)
  const namespace = 'tasks'
  const requestedAction = payload.channel
  const maybeRequestedAction = findAction(namespace, requestedAction)
  if (isNil(maybeRequestedAction)) {
    console.error(`Could not find action ${requestedAction} in ${namespace}`)
  }
  else {
    const resolvedAction: Action = maybeRequestedAction
    const { action } = maybeRequestedAction
    const taskResult = await action(payload)
    return onResult(
      (errors) => console.error({ errors }),
      (data) => console.log({ data }),
      taskResult,
    )
  }
})

subscriber.events.on('error', (error) => {
  console.error('Fatal database connection error:', error)
  process.exit(1)
})

process.on('exit', () => {
  console.log('Closing database notificationlistener...')
  subscriber.close()
  console.log('closed')
})

const connectPgListener = async () => {
  await subscriber.connect()
  await subscriber.listenTo(channel)
}

const server = fastify({ logger: true })

server.register(fastifyPostgres, {
  connectionString: databaseURL,
})

// Declare a route
server.get('/health', async (_request, _reply) => {
  const client = await server.pg.connect()
  const { rows } = await client.query('SELECT version()', [])
  client.release()
  return { db: rows }
})

// Run the server!
const start = async () => {
  try {
    await server.listen(3001)
    server.log.info(
      `server listening on ${(server.server.address() as AddressInfo)?.port}`,
    )
  } catch (err) {
    server.log.error(err)
    process.exit(1)
  }
}

console.log('Connecting database listener...')
connectPgListener()

console.log('Starting http interface...')
start()

console.log('Server is running')
