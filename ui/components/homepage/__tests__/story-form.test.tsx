import StoryForm from 'components/homepage/story-form'
import { render, screen, act } from '@testing-library/react'
import type { Story } from 'domain-logic/stories'
import userEvent from '@testing-library/user-event'

describe('StoryForm', () => {
  it('renders empty form', () => {
    render(<StoryForm setEditing={() => null} editing={null} list={[]} />)

    expect(screen.getAllByRole('textbox').length).toBeGreaterThanOrEqual(3)
    expect(screen.getAllByDisplayValue('').length).toBeGreaterThanOrEqual(3)
  })

  it('resets the form when user hits cancel', () => {
    const dummyStory = {
      asA: 'user',
      iWant: 'test the form',
      soThat: 'the app works',
      id: 'some-id',
    } as Story

    const mockSetEditing = jest.fn()

    render(
      <StoryForm
        setEditing={mockSetEditing}
        editing={'some-id'}
        list={[dummyStory]}
      />
    )

    userEvent.click(screen.getByRole('button', { name: /cancel/i }))

    expect(mockSetEditing).toHaveBeenCalledWith(null)
  })

  it('renders story in editing form', () => {
    const dummyStory = {
      asA: 'user',
      iWant: 'test the form',
      soThat: 'the app works',
      id: 'some-id',
    } as Story

    render(
      <StoryForm
        setEditing={() => null}
        editing={'some-id'}
        list={[dummyStory]}
      />
    )

    expect(screen.getAllByRole('textbox').length).toBeGreaterThanOrEqual(3)
    expect(screen.getByDisplayValue('user'))
    expect(screen.getByDisplayValue('test the form'))
    expect(screen.getByDisplayValue('the app works'))
    expect(screen.getByRole('button', { name: /cancel/i }))
  })
})
