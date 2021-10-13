import { rest } from 'msw'

export const handlers = [
  rest.post('domain-logic/stories', (req, res, ctx) =>
    res(ctx.json({ stories: { markStoryReady: { run: jest.fn() } } }))
  ),

  rest.post('swr', (req, res, ctx) => res(ctx.json({ mutate: jest.fn() }))),
]
