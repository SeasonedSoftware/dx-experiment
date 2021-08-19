import TodosPage from 'pages/index'
import { render, screen } from '@testing-library/react'
import { Story } from '@prisma/client'

describe('TodosPage', () => {
  it('renders', () => {
    render(
      <TodosPage/>
    )

    expect(screen.getByText(/Stories/)).toBeInTheDocument()
  })
})
