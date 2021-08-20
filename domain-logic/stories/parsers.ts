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

const positionParser = z.object({
  storyId: z.string().nonempty(),
  storyAnchor: z.string().nonempty(),
  relativePosition: z.enum(['after', 'before']),
})

export { createParser, updateParser, positionParser }
