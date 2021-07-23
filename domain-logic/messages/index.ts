import { makeAction, exportDomain } from '../prelude'

const { query } = makeAction('messages').http

const messages = exportDomain({
  hello: query<string>()(async () => 'Hello world'),
})

export { messages }
