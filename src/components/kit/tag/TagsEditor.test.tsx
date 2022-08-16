import { render } from '@testing-library/react'
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
})
