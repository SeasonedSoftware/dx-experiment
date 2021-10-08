import TodosPage from 'pages/index'
import { render, screen } from '@testing-library/react'
import { Story } from 'domain-logic/stories'

jest.mock('swr', () => {
  return () => {
    const pendingStory: Story = {
      id: 'some id',
      asA: 'developer',
      iWant: 'write test files',
      soThat: 'I have confidence',
      state: 'pending',
      createdAt: new Date(),
    }

    const readyStory: Story = {
      id: 'some id',
      asA: 'developer',
      iWant: 'To write a new feature',
      soThat: 'I have confidence',
      state: 'ready',
      createdAt: new Date(),
    }

    return { data: [pendingStory, readyStory] }
  }
})

describe('TodosPage', () => {
  it('renders', () => {
    render(<TodosPage />)

    expect(screen.getByText(/Stories/)).toBeInTheDocument()
  })

  it('renders story titles', () => {
    render(<TodosPage />)

    expect(
      screen.getAllByText(/write test files/).length
    ).toBeGreaterThanOrEqual(2)
  })

  it('renders story titles for ready stories', () => {
    render(<TodosPage />)

    expect(
      screen.getAllByText(/To write a new feature/).length
    ).toBeGreaterThanOrEqual(2)
  })
  
})
