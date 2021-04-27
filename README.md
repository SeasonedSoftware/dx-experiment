# DX Experiment

## Quickstart

To start a project from scratch just use the new command and pass your project's name

```
npx dxcli new <project-name>
```

This will create the following directory tree for your project:

* ui (next.js)
  * pages
  * public
  * components
* api
* domain
* lib

## Writting your first project

### Define your api interface

```typescript
export interface TodoSchema extends Schema {
  paths: {
    'POST /todos': {
      request: {
        body: {
          description: string
        }
      }
      response: {
        200: {
          content: string;
        }
      }
    }
  }
}

const postToExternalApi = async (description: String) : Promise<Task|Error> => {
  cont result = await tasks.create({ data: { description } })
  if(result.error){
    return { ... } : Error
  }
  return result.data : Task
}

const endpoints: Service<TodoSchema> = {
  'POST /todos': makeService(postToExternalApi)
};
```

### Home page

```typescript
const Home = ({ todos : Croods<Todo>, ...props }) => {
  if (todos.validating) {
    return 'Loading...'
  }
  return (
    <div>
      {todos.list.map(({ description }) => <p>{description}</p>)
      <form onSubmit={(ev) => {
        ev.preventDefault()
        todos.send('create', { description: input.value })
      }}>
        <input ref={input} type="text" />
        <button type="submit">Add</button>
      </form>
    </div>
  )
}

export const getServerSideProps = useCroods(endpoints, { name: 'todos' })
```

### Define your domain model

```typescript
export type Todo = {
  description: string,
  completedAt: number
}
```
