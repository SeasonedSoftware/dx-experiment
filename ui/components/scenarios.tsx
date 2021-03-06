import { stories, Story } from 'domain-logic/stories'
import { TextArea } from './forms/textarea'
import useSWR, { mutate } from 'swr'
import { useForm, SubmitHandler } from 'react-hook-form'
import type { Scenario } from 'domain-logic/stories'
import { isEmpty } from 'lodash'
import { cx } from '@/lib/utils'

type Props = { story: Story }
type Inputs = Pick<Scenario, 'description'>
export default function Scenarios({ story }: Props) {
  const swrKey = `scenarios-${story.id}`

  const { data } = useSWR(swrKey, () =>
    stories.storyScenarios.run({ id: story.id })
  )
  const { register, reset, handleSubmit, formState } =
    useForm<Inputs>()

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    if (isEmpty(formState.errors)) {
      await stories.addScenario.run({
        storyId: story.id,
        description: data.description,
      })
      mutate(swrKey)
      mutate('stories')
      reset()
    }
  }

  const approveScenario = (scenarioId: string) => async () => {
    await stories.approveScenario.run({ id: scenarioId })
    mutate(swrKey)
    mutate('stories')
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
          className="pb-2 m-4 text-sm border-b last:border-b-0 flex flex-row bg-gray-500 bg-opacity-50"
          key={scenario.id}
        >
          {story.state === 'development' &&
            <button
              onClick={approveScenario(scenario.id)}
              className="text-lg text-green-600"
            >
              ✔
            </button>
          }
          <p className={cx(scenario.approved && 'text-green-500', 'ml-3')}>
            {scenario.description}
          </p>
        </div>
      ))}
    </>
  )
}
