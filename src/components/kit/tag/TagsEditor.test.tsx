import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { TestWrapper } from '../../../utils/test'
import { TagsEditor } from './TagsEditor'

describe('TagsEditor', () => {
  test('should not fail', async () => {
    render(
      <TestWrapper>
        <TagsEditor />
      </TestWrapper>
    )

    const input = await screen.findByLabelText(/Tags/i)
    expect(input).toBeInTheDocument()
  })
  test('should call onUpdate', async () => {
    const fn = jest.fn()
    render(
      <TestWrapper>
        <TagsEditor onUpdate={fn} />
      </TestWrapper>
    )

    const tagsEditorInput = await screen.findByLabelText('Tags')
    userEvent.type(tagsEditorInput, 'Lviv{enter}')

    expect(fn).toBeCalledWith(['Lviv'])
  })
})
