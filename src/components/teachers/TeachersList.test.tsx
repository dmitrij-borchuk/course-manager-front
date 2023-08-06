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
            id: 1,
            name: 'Teacher name',
            role: 'Teacher',
            user: {
              id: 1,
              email: 'email',
              outerId: 'outerId',
            },
            createdAt: '2021-10-10',
            deleted: false,
            updatedAt: '2021-10-10',
            organizationId: 1,
            userId: 1,
            updatedBy: 1,
          },
        ]}
      />
    )

    await screen.findByText('Teacher')
  })
})

function Component(props: ComponentProps<typeof TeachersList>) {
  return (
    <TestWrapper>
      <TeachersList {...props} />
    </TestWrapper>
  )
}
