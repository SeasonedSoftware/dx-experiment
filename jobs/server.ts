// Require the framework and instantiate it
import fastify from 'fastify'
import fastifyPostgres from 'fastify-postgres'
import createSubscriber from 'pg-listen'
import rules from 'domain-logic'
import { AddressInfo } from 'net'

console.log('TEST', rules)

const databaseURL: string = 'postgres://postgres@localhost/postgres'

// Accepts the same connection config object that the "pg" package would take
const subscriber = createSubscriber({ connectionString: databaseURL })

subscriber.notifications.on('my-channel', (payload) => {
  // Payload as passed to subscriber.notify() (see below)
  console.log("Received notification in 'my-channel':", payload)
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
  await subscriber.listenTo('my-channel')
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
