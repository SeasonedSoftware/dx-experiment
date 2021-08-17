import TodosPage from 'pages/index'
import { render, screen } from '@testing-library/react'
import { Story } from '@prisma/client'

describe('TodosPage', () => {
  it('renders', () => {
    render(
      <TodosPage
        initialData={[
          {
            id: '1',
            asA: 'User',
            iWant: 'Edit my stories',
            soThat: 'I can feel like an admin',
          } as Story,
        ]}
      />
    )

    expect(screen.getByText(/Stories/)).toBeInTheDocument()
    expect(screen.getAllByText(/edit my stories/i).length).toBe(2)
  })
})
