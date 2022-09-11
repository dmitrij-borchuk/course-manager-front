import { render, screen } from '@testing-library/react'
import { ComponentProps } from 'react'
import { noop } from '../../utils/common'
import { mockOrgId, TestWrapper } from '../../utils/test'
import { Register } from './Register'

describe('Register', () => {
  test('Should show Login link', async () => {
    mockOrgId()
    renderComponent()

    await screen.findByRole('link', { name: 'Login' })
  })
})

function renderComponent(props: Partial<ComponentProps<typeof Register>> = {}) {
  return render(
    <TestWrapper>
      <Register onSubmit={noop} {...props} />
    </TestWrapper>
  )
}
