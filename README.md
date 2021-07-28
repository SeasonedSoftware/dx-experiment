## Definitions

### Action

Data structure with domain nomenclature. It has a parser to obtain parameters from user input, a main computation that can be called, and it's bound to a transport used to exchange parameters and results with the call site.

The execution is always on the server-side.

Actions are always namespaced inside a name that will represent the main domain concept it manipulates.

### Transport

Type used to model how a given action is called and have its results delivered to the call site. An action that is supposed to be called over HTTP will have the `http` transport.

This is important to limit how actions can be called since you might have actions that are not supposed to be exposed over HTTP (background jobs are usually a good example of this case).

### Queries and Mutations

A Query is an Action that will have no side-effect on the server side. A Mutation on the other hand will have side-effects (e.g. database update, a call to an external API or writing some file on disk).

Try to limit your Query actions to simple database reads where you can afford to send cached data or constant values. Most of your actions are probably going to be mutations.

## Creating your first action

Start by scaffolding the necessary files for your actions using the command line interface:

```bash
dx-cli add:domain messages
```

This command will create the `messages` folder under `domain-logic` and adds the necessary wiring to `domain-logic/index.ts`.

You will find in the `domain-logic/messages/index.ts` file an empty domain called `messages`:

```ts
import { exportDomain } from '../prelude'

const messages = exportDomain('messages', {})
export { messages }
```

Then import some useful function from prelude inside `domain-logic/messages/index.ts` so we can build your first action:

```ts
import { exportDomain, makeAction } from '../prelude'
```

After that we can get our action constructor for the `http` transport, since our first action will be a simple hello world that takes no parameters over a HTTP `GET` call.
You can destructure http action constructor by using the line:

```ts
const { query } = makeAction.http
```

Note that there are always 2 kinds of constructors, `query` and `mutation`.
The next step is to call the constructor and store a key named after your action inside the `messages` domain:

```ts
const messages = exportDomain('messages', {
  hello: query()(async () => ({ message: 'Hello World' })),
})
```

Let's assume that our domain here is a simple translation engine. When you call a given action in this domain called `messages` that action will give a string that can be used as copy on your user interface. Similar to an `I18n` function.
Export at the end of the file the object that you have built with the actions.
The entire file `domain-logic/messages/index.ts` should look like this:

```ts
import { exportDomain, makeAction } from '../prelude'
const { query } = makeAction.http
const messages = exportDomain('messages', {
  hello: query()(async () => ({ message: 'Hello World' })),
})
export { messages }
```

## Calling your first action

To call your action from a page on the browser you will code a [React](https://reactjs.org) component on a [Next.JS](https://nextjs.org) application that sits on the `ui` folder.

```bash
dx-cli add:page home
```

```ts
const result = await messages.hello.run()
console.log(result) // Hello world
```

```ts
const result = await messages.hello.run().catch(() => 'Fallback')
console.log(result) // Fallback
```
