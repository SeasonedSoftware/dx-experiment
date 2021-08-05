import { Prisma, Story } from '@prisma/client'
import { useForm, SubmitHandler } from 'react-hook-form'
import { stories } from 'domain-logic/stories'
import { isEmpty } from 'lodash'
import { zodResolver } from '@hookform/resolvers/zod'
import { mutate } from 'swr'
import { createParser } from 'domain-logic/stories/parsers'
import { Input } from 'components/forms/input'
import { useEffect } from 'react'

type Inputs = Pick<Prisma.StoryCreateInput, 'asA' | 'iWant' | 'soThat'>

type Props = {
  list?: Story[]
  editing: string | null
  setEditing: (a: string | null) => void
}
export default function StoryForm({ list, editing, setEditing }: Props) {
  const { register, reset, setFocus, handleSubmit, formState } =
    useForm<Inputs>({
      resolver: zodResolver(createParser),
    })

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    if (isEmpty(formState.errors)) {
      editing
        ? await stories.update.run({ ...data, id: editing! })
        : await stories.create.run(data)
      mutate('stories')
      reset()
      setEditing(null)
      setFocus('asA')
    }
  }

  useEffect(() => {
    const story = list?.find(({ id }) => id === editing)
    reset({ asA: story?.asA, iWant: story?.iWant, soThat: story?.soThat })
  }, [editing])

  return (
    <form
      className="flex flex-col w-full gap-1 shadow-lg divide-y divide-gray-200 dark:divide-gray-700"
      onSubmit={handleSubmit(onSubmit)}
    >
      <Input
        {...register('asA')}
        placeholder="As a"
        error={formState.errors.asA}
      />
      <Input
        {...register('iWant')}
        placeholder="I want to"
        error={formState.errors.iWant}
      />
      <Input
        {...register('soThat')}
        placeholder="So that"
        error={formState.errors.soThat}
      />
      <button
        className="p-4 text-2xl bg-blue-400 dark:bg-blue-900 text-center"
        type="submit"
      >
        {editing ? 'Save' : 'Create'}
      </button>
    </form>
  )
}
