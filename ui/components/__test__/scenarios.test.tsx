import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import { Scenario, Story } from 'domain-logic/stories'

import Scenarios from '../scenarios'

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

const developmentStory: Story =
{
  id: 'draft-story-1',
  asA: 'developer',
  iWant: 'see the stories list',
  soThat: 'I have confidence',
  state: 'development',
  createdAt: new Date(),
}

jest.mock('domain-logic/stories', () => ({
  ...jest.requireActual('domain-logic/stories'),
  stories: { storyScenarios: { run: jest.fn() } },
}))

jest.mock('swr', () => {
  return () => {
    const scenario: Scenario = {
      id: 'some id',
      storyId: 'some-story-id',
      createdAt: new Date(),
      description: 'given a scenario',
      approved: false
    }

    return { data: [scenario] }
  }
})

describe(Scenarios, () => {
  it('renders scenarios form', () => {
    render(<Scenarios story={draftStory} />)
    expect(screen.getByRole('textbox')).toBeInTheDocument()
  })

  it('renders scenarios list', () => {
    render(<Scenarios story={draftWithScenariosStory} />)
    expect(screen.getByText('given a scenario')).toBeInTheDocument()
  })

  it('renders scenarios list without approve button when story is in draft', () => {
    render(<Scenarios story={draftWithScenariosStory} />)
    expect(screen.queryByRole('button', { name: '✔' })).not.toBeInTheDocument()
  })

  it('renders scenarios list with approve button when story is in development', () => {
    render(<Scenarios story={developmentStory} />)
    expect(screen.getByRole('button', { name: '✔' })).toBeInTheDocument()
  })
})


