import { z } from 'zod'

const storyCreateParser = z.object({
  asA: z.string().nonempty(),
  iWant: z.string().nonempty(),
  soThat: z.string().nonempty(),
})

export { storyCreateParser }
