import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import * as reactRouterDom from 'react-router-dom'
import { asMock, mockDoc, mockGetDocs, TestWrapper, getAxiosMock } from '../../utils/test'
import { AttendanceEditorPage } from './AttendanceEditor'
import * as firestore from 'firebase/firestore'
import { Attendance } from '../../types/attendance'

jest.mock('react-materialize', () => ({
  ...jest.requireActual('react-materialize'),
  DatePicker: ({ label, onChange, ...props }: any) => (
    <label>
      {label}
      <input onChange={(e) => onChange(new Date(e.currentTarget.value))} {...props} />
    </label>
  ),
  Button: ({ flat, ...props }: any) => <button {...props} />,
}))

const { useParams } = asMock(reactRouterDom)
const { setDoc } = asMock(firestore)

const treeDaysInMs = 1000 * 60 * 60 * 24 * 3
const twoDaysInMs = 1000 * 60 * 60 * 24 * 2
const oneDayInMs = 1000 * 60 * 60 * 24 * 1

describe('AttendanceEditor', () => {
  const axiosMock = getAxiosMock()

  beforeEach(() => {
    useParams.mockReturnValue({
      orgId: 'orgId',
    })
    axiosMock.onGet('/organizations').reply(200, [{ key: 'orgId', id: 1 }])
    axiosMock.onGet('/users/byOuterId/1/userId').reply(200, { outerId: 'userId', id: 1 })
    axiosMock.onGet('/users/byOuterId/1/teacher1').reply(200, { outerId: 'userId', id: 1 })
    axiosMock.onGet('/activities').reply(200, [
      {
        performer: 1,
        name: 'group 1',
        outerId: 'g1',
        id: 1,
      },
    ])
  })

  afterEach(() => {
    axiosMock.reset()
  })

  test('should not fail', async () => {
    defaultMock()
    render(
      <TestWrapper initialState={storeWithOrg}>
        <AttendanceEditorPage />
      </TestWrapper>
    )

    await screen.findByLabelText('Date *')
    await screen.findByRole('option', { name: 'Group' })
  })

  // TODO: rewrite test when new API will be used
  // Probably this test should be moved to e2e testing
  test('while creating should show students assigned at the specific date', async () => {
    const {
      data: { group, students },
    } = defaultMock()
    const [student1, student2] = students
    axiosMock.onGet(new RegExp('/students/byActivity/1')).reply(200, students)

    render(
      <TestWrapper initialState={storeWithOrg}>
        <AttendanceEditorPage />
      </TestWrapper>
    )
    await screen.findAllByText(group.name)
    await selectGroup(group.id)

    // Check that both students are exist
    await screen.findByText(student1.name)
    await screen.findByText(student2.name)

    axiosMock.onGet(new RegExp('/students/byActivity/1')).reply(200, [students[1]])

    const datePicker = screen.getByLabelText('Date *')
    const time = new Date().getTime() - twoDaysInMs
    userEvent.type(datePicker, `${new Date(time).toLocaleDateString()}`)

    // Check that only one student is exist
    await screen.findByText(student2.name)
    expect(screen.queryByText(student1.name)).toBeNull()
  })

  test('while editing a teacher should preserved', async () => {
    useParams.mockReturnValue({
      orgId: 'orgId',
      id: 'attendanceId',
    })
    const {
      data: { group, students },
      mockDocByPath,
    } = defaultMock()

    const attendance: Attendance = {
      id: 'attendanceId',
      attended: {},
      date: new Date().getTime(),
      group: group.id,
      teacher: 'teacher1',
    }
    mockDocByPath('organizations/orgId/attendances/attendanceId', attendance)
    axiosMock.onGet(new RegExp('/students/byActivity/1')).reply(200, students)

    render(
      <TestWrapper initialState={storeWithOrg}>
        <AttendanceEditorPage />
      </TestWrapper>
    )

    await selectGroup(group.id)

    const submitBtn = await screen.findByRole('button', {
      name: /Submit/i,
    })

    expect(submitBtn).toBeEnabled()
    fireEvent.click(submitBtn)

    await screen.findByText('Report has been successfully submitted')

    expect(setDoc).toBeCalled()
    expect(setDoc.mock.calls[0][1]).toHaveProperty('teacher', attendance.teacher)
  })

  test('Should show groups of teacher', async () => {
    const {
      data: { group, students },
      mockDataByPath,
    } = defaultMock()
    axiosMock.onGet(new RegExp('/students/byActivity/1')).reply(200, students)

    const groups = [
      {
        id: 'group1',
        name: 'Group 1',
        teacher: 'teacher1',
      },
      {
        id: 'group2',
        name: 'Group 2',
        teacher: 'teacher2',
      },
    ]
    mockDataByPath('organizations/orgId/groups', groups)

    render(
      <TestWrapper initialState={storeWithOrg}>
        <AttendanceEditorPage />
      </TestWrapper>
    )

    await screen.findByRole('option', { name: 'Group' })
    await selectGroup(group.id)

    const req = axiosMock.history.get.filter((r) => r.url === '/activities' && r.params.performerId === 1)
    expect(req.length).toBeGreaterThan(0)

    const groupSelect = await screen.findByTestId('group-selector')
    // eslint-disable-next-line testing-library/no-node-access
    const options = groupSelect.querySelectorAll('option')
    const optArray = Array.from(options)
    expect(optArray.map((o) => o.textContent)).toContain('group 1')
  })

  function defaultMock() {
    const { mockDataByPath } = mockGetDocs()
    const group = {
      teacher: 'teacher1',
      name: 'group 1',
      id: 'g1',
    }
    const student1 = {
      id: 1,
      outerId: 's1',
      name: 'Student name 1',
      groups: [group.id],
    }
    const student2 = {
      id: 2,
      outerId: 's2',
      name: 'Student name 2',
      groups: [group.id],
    }
    const studentsToGroup = [
      {
        id: 's2g1',
        startDate: new Date().getTime() - oneDayInMs,
        endDate: null,
        studentId: student1.outerId,
      },
      {
        id: 's2g2',
        startDate: new Date().getTime() - treeDaysInMs,
        endDate: null,
        studentId: student2.outerId,
      },
    ]
    mockDataByPath('organizations/orgId/studentsToGroups', studentsToGroup)

    const { mockDocByPath } = mockDoc()
    mockDocByPath('organizations/orgId/users', { id: 'userId' })

    return {
      mockDataByPath,
      mockDocByPath,
      data: {
        group,
        studentsToGroup,
        students: [student1, student2],
      },
    }
  }
})

async function selectGroup(id: string) {
  const groupSelect = await screen.findByTestId('group-selector')
  fireEvent.change(groupSelect, { target: { value: id } })
}

const storeWithOrg = {
  organizations: {
    currentOrg: {
      loading: false,
      data: {
        id: 1,
        key: 'orgId',
      },
    },
  },
}
