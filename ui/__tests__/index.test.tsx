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

    const approvedStory: Story = {
      id: 'some id',
      asA: 'product owner',
      iWant: 'approve stories',
      soThat: 'I track progress',
      state: 'approved',
      createdAt: new Date(),
    }

    return { data: [pendingStory, approvedStory] }
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

  it('renders completed story titles', () => {
    render(<TodosPage />)

    expect(
      screen.getAllByText(/approve stories/).length
    ).toBeGreaterThanOrEqual(2)
  })
})
