import { Prisma } from '@prisma/client'
import { useForm, SubmitHandler } from 'react-hook-form'
import { stories } from 'domain-logic/stories'
import { isEmpty } from 'lodash'
import { zodResolver } from '@hookform/resolvers/zod'
import { mutate } from 'swr'
import { storyCreateParser } from 'domain-logic/stories/parsers'
import { Input } from 'components/forms/input'

type Inputs = Pick<Prisma.StoryCreateInput, 'asA' | 'iWant' | 'soThat'>

const StoryForm = () => {
  const { register, reset, handleSubmit, formState } = useForm<Inputs>({
    resolver: zodResolver(storyCreateParser),
  })

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    if (isEmpty(formState.errors)) {
      await stories.create.run(data)
      mutate('stories')
      reset()
    }
  }

  return (
    <form className="flex flex-col w-full" onSubmit={handleSubmit(onSubmit)}>
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
      <button className="p-4 text-2xl bg-blue-900 text-center" type="submit">
        Create
      </button>
    </form>
  )
}

export default StoryForm
