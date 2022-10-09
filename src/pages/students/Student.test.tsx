import { render, screen } from '@testing-library/react'
import { getAxiosMock, mockDoc, mockGetDocs, mockUrlParams, TestWrapper } from '../../utils/test'
import StudentPage from './Student'

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
