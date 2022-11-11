import { render, screen } from '@testing-library/react'
import { getAxiosMock, mockDoc, mockGetDocs, mockUrlParams, TestWrapper } from '../../utils/test'
import { createFirebaseMock } from '../../utils/tests/firebaseMock'
import StudentPage from './Student'

jest.useFakeTimers()

describe('Student', () => {
  let getDocs!: ReturnType<typeof mockGetDocs>
  let getDoc!: ReturnType<typeof mockDoc>
  const axiosMock = getAxiosMock()
  beforeEach(() => {
    getDocs = mockGetDocs()
    getDoc = mockDoc()
  })
  test('should omit attendance without student in calculation', async () => {
    makeDefaultMock()
    render(
      <TestWrapper>
        <StudentPage />
      </TestWrapper>
    )

    const rate = await screen.findByTestId('attendance-rate-badge')
    expect(rate).toHaveTextContent('50%')
  })

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

  function makeDefaultMock() {
    mockUrlParams({
      id: 'st1',
      orgId: 'orgId',
    })
    getDocs.mockDataByPath('organizations/orgId/attendances', [
      {
        id: 'attendance1',
        attended: {
          st1: true,
          st2: true,
          st3: false,
        },
        group: 'group1',
      },
      {
        id: 'attendance2',
        attended: {
          st1: true,
          st2: false,
          st3: true,
        },
        group: 'group2',
      },
      {
        id: 'attendance3',
        attended: {
          st1: false,
          st2: true,
          st3: true,
        },
        group: 'group1',
      },
      {
        id: 'attendance4',
        attended: {
          st2: true,
          st3: true,
        },
        group: 'group1',
      },
    ])
    const from = new Date()
    from.setMonth(from.getMonth() - 1)
    getDocs.mockDataByPath('organizations/orgId/groups', [
      {
        id: 'group1',
        name: 'group name',
        teacher: 'teacherId',
      },
    ])
    getDocs.mockDataByPath('organizations/orgId/studentsToGroups', [
      {
        groupId: 'group1',
        studentId: 'st1',
        startDate: from.getTime(),
        endDate: null,
      },
      {
        groupId: 'group2',
        studentId: 'st1',
        startDate: from.getTime(),
        endDate: null,
      },
    ])
    getDoc.mockDocByPath('organizations/orgId/students/st1', {
      id: 'st1',
      name: 'studentName',
    })

    axiosMock.onGet('/organizations').reply(200, [
      {
        id: 1,
        key: 'orgId',
        name: 'orgName',
      },
    ])
    axiosMock.onGet(`/users/byOuterId/1/teacherId`).reply(200, {
      id: 1,
      name: 'orgName',
      email: 'email',
      outerId: 'teacherId',
    })
    axiosMock.onGet(`/users/1`).reply(200, [
      {
        id: 1,
        name: 'orgName',
        email: 'email',
        outerId: 'teacherId',
      },
    ])
  }
})
