import { stories, Story } from 'domain-logic/stories'
import { TextArea } from './forms/textarea'
import useSWR from 'swr'

type Props = {
  story: Story
}
export default function Scenario({ story }: Props) {
  const { data } = useSWR(`scenarios-${story.id}`, () =>
    stories.storyScenarios.run({ id: story.id })
  )

  const handleSubmit: React.FormEventHandler = (ev) => {
    ev.preventDefault()
  }

  return (
    <>
      <form onSubmit={handleSubmit} className="p-4 flex flex-col">
        <label htmlFor="description">Scenario</label>
        <TextArea
          className="mt-2"
          rows={3}
          name="description"
          placeholder={`Given ...\nWhen ...\nThen ...`}
        />
        <button
          className="self-end p-2 bg-blue-400 dark:bg-blue-900"
          type="submit"
        >
          Add scenario
        </button>
      </form>
      {data?.map((item) => (
        <div
          className="m-4 pb-2 text-sm border-b last:border-b-0"
          key={item.id}
        >
          <p>{item.description}</p>
          <p className="mt-2 text-xs text-right text-gray-900 text-opacity-60 dark:text-white dark:text-opacity-50">
            {item.createdAt.toLocaleDateString()}
          </p>
        </div>
      ))}
    </>
  )
}
