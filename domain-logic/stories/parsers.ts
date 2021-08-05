import { z } from 'zod'

const createParser = z.object({
  asA: z.string().nonempty(),
  iWant: z.string().nonempty(),
  soThat: z.string().nonempty(),
})

const updateParser = z.object({
  id: z.string(),
  asA: z.string().nonempty(),
  iWant: z.string().nonempty(),
  soThat: z.string().nonempty(),
})

export { createParser, updateParser }
