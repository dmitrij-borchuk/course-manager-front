import { render, screen } from '@testing-library/react'
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
})
