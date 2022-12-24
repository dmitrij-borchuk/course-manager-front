import { render, screen, within } from '@testing-library/react'
import { Student } from '../../types/student'
import { getAxiosMock, mockGetDocs, mockUrlParams, TestWrapper } from '../../utils/test'
import Group from './Group'

describe('Group', () => {
  let getDocs!: ReturnType<typeof mockGetDocs>
  let am: any
  beforeEach(() => {
    const axiosMock = getAxiosMock()
    axiosMock.onGet('/organizations').reply(200, [
      {
        id: 1,
        key: 'orgId',
        name: 'orgName',
      },
    ])
    axiosMock.onGet(`/activities/1`).reply(200, {
      id: 1,
      name: 'group name',
      teacher: 'teacherId',
      outerId: 'group1',
    })
    axiosMock.onGet(`/users/1`).reply(200, [
      {
        id: 1,
        name: 'orgName',
        email: 'email',
        outerId: 'teacherId',
      },
    ])
    axiosMock.onGet(`/students`).reply(200, [
      {
        id: 1,
        name: 'studentName',
        outerId: 'st1',
      },
    ])
    axiosMock.onGet(new RegExp('/students/byActivity/1')).reply(200, [
      {
        id: 1,
        name: 'studentName',
        outerId: 'st1',
      },
    ])
    getDocs = mockGetDocs()
    am = axiosMock
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
      id: '1',
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
    ])
    const from = new Date()
    from.setMonth(from.getMonth() - 1)
  }
})

function renderGroup() {
  return render(
    <TestWrapper>
      <Group />
    </TestWrapper>
  )
}
