import TodosPage from 'pages/index'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'

describe('TodosPage', () => {
  it('renders', () => {
    render(<TodosPage initialData={[]} />)

    expect(screen.getByText(/Stories/)).toBeInTheDocument()
  })
})