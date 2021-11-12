import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import { Story } from 'domain-logic/stories'

import StoriesItem from '../story-item'

const draftWithScenariosStory: Story =
{
  id: 'draft-story-1',
  asA: 'developer',
  iWant: 'see the stories list',
  soThat: 'I have confidence',
  state: 'draft_with_scenarios',
  createdAt: new Date(),
}

const draftStory: Story =
{
  id: 'draft-story-1',
  asA: 'developer',
  iWant: 'see the stories list',
  soThat: 'I have confidence',
  state: 'draft',
  createdAt: new Date(),
}

jest.mock('domain-logic/stories', () => ({
  ...jest.requireActual('domain-logic/stories'),
  stories: { markStoryReady: { run: jest.fn() } },
}))

jest.mock('swr', () => ({ ...jest.requireActual('swr'), mutate: jest.fn() }))

describe(StoriesItem, () => {
  it('renders story card', () => {
    render(
      <StoriesItem
        story={draftStory}
        setEditing={() => null}
        onClickAfter={() => null}
        onClickBefore={() => null}
      />
    )

    expect(screen.getByText(/As a/i)).toBeInTheDocument()
    expect(screen.queryByText(/ready to start/i)).not.toBeInTheDocument()
  })

  it('render ready to start when pending with scenarios', () => {
    render(
      <StoriesItem
        story={draftWithScenariosStory}
        setEditing={() => null}
        onClickAfter={() => null}
        onClickBefore={() => null}
      />
    )

    expect(screen.getByText(/ready to start/i)).toBeInTheDocument()
  })

})

