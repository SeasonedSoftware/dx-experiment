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
      reset()
    }
  }

  const approveScenario = (scenarioId: string) => async () => {
    await stories.approveScenario.run({ id: scenarioId })
    mutate(swrKey)
  }

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col p-4">
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
      {data?.map((scenario) => (
        <div
          className="pb-2 m-4 text-sm border-b last:border-b-0"
          key={scenario.id}
        >
          <p>
            {scenario.description} - {scenario.approved}
          </p>
          <p className="mt-2 text-xs text-right text-gray-900 text-opacity-60 dark:text-white dark:text-opacity-50">
            {scenario.createdAt.toLocaleDateString()}
          </p>
          <button
            onClick={approveScenario(scenario.id)}
            className="text-lg text-green-600"
          >
            ✔
          </button>
        </div>
      ))}
    </>
  )
}
