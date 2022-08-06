import { render, screen } from '@testing-library/react'
import { ComponentProps } from 'react'
import { mockOrgId, TestWrapper } from '../../utils/test'
import { TeachersList } from './TeachersList'

describe('TeachersList', () => {
  beforeEach(() => {
    mockOrgId('orgId')
  })
  test('Renders user role', async () => {
    render(
      <Component
        items={[
          {
            id: 'id',
            name: 'Teacher name',
            role: 'Teacher',
          },
        ]}
      />
    )

    screen.getByText('Teacher')
  })
})

function Component(props: ComponentProps<typeof TeachersList>) {
  return (
    <TestWrapper>
      <TeachersList {...props} />
    </TestWrapper>
  )
}
