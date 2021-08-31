import { stories, Story } from 'domain-logic/stories'
import { TextArea } from './forms/textarea'
import useSWR, { mutate } from 'swr'
import { useForm, SubmitHandler } from 'react-hook-form'
import type { Scenario } from 'domain-logic/stories'
import { isEmpty } from 'lodash'

type Props = {
  story: Story
}

type Inputs = Pick<Scenario, 'description'>

export default function Scenarios({ story }: Props) {
  const swrKey = `scenarios-${story.id}`

  const { data } = useSWR(swrKey, () =>
    stories.storyScenarios.run({ id: story.id })
  )
  const { register, reset, setFocus, handleSubmit, formState } =
    useForm<Inputs>()

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    if (isEmpty(formState.errors)) {
      await stories.addScenario.run({
        storyId: story.id,
        description: data.description,
      })
      mutate(swrKey)
    }
  }

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="p-4 flex flex-col">
        <label htmlFor="description">Scenario</label>
        <TextArea
          className="mt-2"
          rows={3}
          placeholder={`Given ...\nWhen ...\nThen ...`}
          {...register('description')}
          error={formState.errors.description}
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
