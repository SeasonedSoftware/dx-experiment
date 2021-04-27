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

### Home page
```
const Home = ({ todos : Croods<Todo>, ...props }) => {
  return <div/>
}

export const getServerSideProps = { fetch: useCroodsFetch(options), create: useCroodsCreate(options) }
```

### Define your domain interface

```
export type Todo = {
  description: string,
  completedAt: number
}
```

### Define your events

```
const postToExternalApi = async (description: String) : Promise<Task|Error> => {
  cont result = await tasks.create({ data: { description } })
  if(result.error){
    return { ... } : Error
  }
  return result.data : Task
}
```