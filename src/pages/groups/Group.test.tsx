import { render, screen, within } from '@testing-library/react'
import { Student } from '../../types/student'
import { getAxiosMock, mockDoc, mockGetDocs, mockUrlParams, TestWrapper } from '../../utils/test'
import Group from './Group'

describe('Group', () => {
  let getDocs!: ReturnType<typeof mockGetDocs>
  let getDoc!: ReturnType<typeof mockDoc>
  beforeEach(() => {
    const axiosMock = getAxiosMock()
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
    axiosMock.onGet(`/students/byOrganization/1`).reply(200, [
      {
        id: 1,
        name: 'studentName',
        outerId: 'st1',
      },
    ])
    getDocs = mockGetDocs()
    getDoc = mockDoc()
  })
  test('should render attendance rate related to current group only', async () => {
    const student: Student = {
      id: 1,
      name: 'studentName',
      outerId: 'st1',
      tags: [],
    }
    mockDataForGroupFiltering()

    renderGroup()

    const studentLine = await screen.findByTestId(`student-${student.id}`)
    const rate = within(studentLine).getByTestId('attendance-rate-badge')
    expect(rate).toHaveTextContent('50%')
  })
  function mockDataForGroupFiltering() {
    mockUrlParams({
      id: 'group1',
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
        // date:
        group: 'group1',
        // teacher: string
      },
      {
        id: 'attendance2',
        attended: {
          st1: true,
          st2: false,
          st3: true,
        },
        // date:
        group: 'group2',
        // teacher: string
      },
      {
        id: 'attendance3',
        attended: {
          st1: false,
          st2: true,
          st3: true,
        },
        // date:
        group: 'group1',
        // teacher: string
      },
    ])
    const from = new Date()
    from.setMonth(from.getMonth() - 1)
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
    getDoc.mockDocByPath('organizations/orgId/groups/group1', {
      id: 'group1',
      name: 'group name',
      teacher: 'teacherId',
    })
  }
})

function renderGroup() {
  return render(
    <TestWrapper>
      <Group />
    </TestWrapper>
  )
}
