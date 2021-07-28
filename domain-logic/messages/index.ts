import { makeAction, exportDomain } from '../prelude'

const { query } = makeAction.http

const messages = exportDomain('messages', {
  hello: query<string>()(async () => 'Hello'),
})

export { messages }
