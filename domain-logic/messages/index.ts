import { makeAction, exportDomain, serverOrBrowser } from '../prelude'

const { query } = makeAction('messages').http

const messages = exportDomain({
  hello: query<string>()(async () => {
    serverOrBrowser(
      () => {
        console.log('>>>>>>>>>>>>>>>>> SERVER')
      },
      () => {
        console.log('>>>>>>>>>>>>>>>>> BROWSER')
      }
    )

    return 'Hello world'
  }),
})

export { messages }
