import { render, screen } from '@testing-library/react'
import { getAxiosMock, mockOrgId, TestWrapper } from '../../utils/test'
import { createFirebaseMock } from '../../utils/tests/firebaseMock'
import { TeachersListPage } from './TeachersList'

describe('TeachersList', () => {
  let axiosMock: ReturnType<typeof getAxiosMock>

  beforeEach(() => {
    mockOrgId('orgId')
    createFirebaseMock()
    axiosMock = getAxiosMock()
    axiosMock.onGet('/organizations').reply(200, [
      {
        key: 'orgId',
        id: 'orgId',
      },
    ])
  })
  test('should render teachers list', async () => {
    axiosMock.onGet(`/users/orgId`).reply(200, [
      {
        id: 'uid',
        name: 'User Name',
      },
    ])
    render(
      <TestWrapper>
        <TeachersListPage />
      </TestWrapper>
    )

    await screen.findByText('User Name')
  })
})
