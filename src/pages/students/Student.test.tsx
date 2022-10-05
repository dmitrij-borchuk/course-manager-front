import { render, screen } from '@testing-library/react'
import { getAxiosMock, mockUrlParams, TestWrapper } from '../../utils/test'
import { createFirebaseMock } from '../../utils/tests/firebaseMock'
import Student from './Student'

jest.useFakeTimers()

describe('Student', () => {
  test('should create an instance', async () => {
    jest.setSystemTime(new Date('2020-04-01'))
    mockUrlParams({ orgId: 'orgId', id: '1' })
    const fbMock = createFirebaseMock()
    const axiosMock = getAxiosMock()
    axiosMock.onGet('/organizations').reply(200, [
      {
        key: 'orgId',
        id: 1,
      },
    ])
    axiosMock.onGet(`/students/1?orgId=1`).reply(200, { id: 1, name: 'name', outerId: 'outerId' })
    fbMock.mockDataByPath('/organizations/orgId/groups', [
      {
        id: 'groupId',
        name: 'group',
      },
      {
        id: 'groupId2',
        name: 'group 2',
      },
    ])
    fbMock.mockDataByPath('/organizations/orgId/studentsToGroups', [
      {
        id: 'st2groupId',
        groupId: 'groupId',
        studentId: 'outerId',
        startDate: new Date('2020-01-01').getTime(),
        endDate: new Date('2020-02-01').getTime(),
      },
      {
        id: 'st2groupId2',
        groupId: 'groupId2',
        studentId: 'outerId',
        startDate: new Date('2020-01-01').getTime(),
        endDate: null,
      },
      {
        id: 'st2groupId3',
        groupId: 'groupId2',
        studentId: 'outerId2',
        startDate: new Date('2020-01-01').getTime(),
        endDate: null,
      },
    ])

    render(
      <TestWrapper>
        <Student />
      </TestWrapper>
    )

    const rateBadge = await screen.findByTestId('attendance-rate-badge')
  })
})
