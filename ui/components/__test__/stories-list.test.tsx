import '@testing-library/jest-dom'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Story, stories as domainStories } from 'domain-logic/stories'
import { mutate } from 'swr'

import StoriesList from '../stories-list'

const stories: Story[] = [
  {
    id: 'pending-story-1',
    asA: 'developer',
    iWant: 'see the stories list',
    soThat: 'I have confidence',
    state: 'pending',
    createdAt: new Date(),
  },
  {
    id: 'pending-story-2',
    asA: 'user',
    iWant: 'see the stories list',
    soThat: 'I have confidence',
    state: 'pending',
    createdAt: new Date(),
  },
]

jest.mock('domain-logic/stories', () => ({
  ...jest.requireActual('domain-logic/stories'),
  stories: { markStoryReady: { run: jest.fn() } },
}))

jest.mock('swr', () => ({ ...jest.requireActual('swr'), mutate: jest.fn() }))

const mockedSetEditing = jest.fn()

describe(StoriesList, () => {
  it('renders stories list with items', () => {
    render(
      <StoriesList
        items={stories}
        title="Draft"
        setEditing={mockedSetEditing}
      />
    )

    expect(screen.getByRole('heading', { name: 'Draft' })).toBeInTheDocument()
    expect(screen.getAllByText(/I have confidence/i).length).toBe(2)
  })

  it('renders empty stories list and without title', async () => {
    render(<StoriesList items={[]} title="" setEditing={mockedSetEditing} />)

    expect(
      screen.queryByRole('heading', { name: 'Draft' })
    ).not.toBeInTheDocument()
    expect(screen.getByText(/there are no items to show/i)).toBeInTheDocument()
  })

  it('should be able to click the button and call functions with props', async () => {
    render(
      <StoriesList
        items={stories}
        title="pending"
        setEditing={mockedSetEditing}
      />
    )

    const markAsReadyButtons = screen.getAllByText(/mark as ready to start/i)

    expect(markAsReadyButtons.length).toBe(2)
    userEvent.click(markAsReadyButtons[0])
    await waitFor(() =>
      expect(domainStories.markStoryReady.run).toHaveBeenCalledWith({
        id: stories[0].id,
      })
    )
    expect(mutate).toHaveBeenCalledWith('stories')
  })
})
