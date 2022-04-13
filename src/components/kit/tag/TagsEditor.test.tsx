import { act, render, screen } from '@testing-library/react'
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
  })
  test('should be able to adit tag', async () => {
    const onUpdate = jest.fn()
    render(
      <TestWrapper>
        <TagsEditor value={['tag1', 'tag2']} onUpdate={onUpdate} />
      </TestWrapper>
    )

    const tagToEdit = screen.getByText('tag1')
    userEvent.click(tagToEdit)
    const tagInput = screen.getByLabelText('New tag')
    act(() => {
      userEvent.type(tagInput, 'edited{enter}')
    })

    expect(onUpdate).toHaveBeenLastCalledWith(['tag1edited', 'tag2'])
  })
})
