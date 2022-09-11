import { act, fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import * as reactRouterDom from 'react-router-dom'
import { asMock, mockDoc, mockGetDocs, TestWrapper } from '../../utils/test'
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
  beforeEach(() => {
    useParams.mockReturnValue({
      orgId: 'orgId',
      // id: 'attendanceId',
    })
    const { mockDocByPath } = mockDoc()
    mockDocByPath('', { id: 'orgUserId' })
  })

  test('should not fail', async () => {
    render(
      <TestWrapper>
        <AttendanceEditorPage />
      </TestWrapper>
    )

    await screen.findByLabelText('Date *')
    await screen.findByRole('option', { name: 'Group' })
  })

  // TODO: rewrite test when new API will be used
  test('while creating should show students assigned at the specific date', async () => {
    const {
      data: {
        group,
        students: [student1, student2],
      },
      mockDataByPath,
    } = defaultMock()

    render(
      <TestWrapper>
        <AttendanceEditorPage />
      </TestWrapper>
    )
    await screen.findAllByText(group.name)
    await selectGroup(group.id)

    // Check that both students are exist
    await screen.findByText(student1.name)
    await screen.findByText(student2.name)

    const studentsToGroupFiltered = [
      {
        id: 's2g2',
        startDate: new Date().getTime() - treeDaysInMs,
        endDate: null,
        studentId: student2.id,
      },
    ]
    mockDataByPath('organizations/orgId/studentsToGroups', studentsToGroupFiltered)

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
      data: { group },
      mockDocByPath,
    } = defaultMock()

    const attendance: Attendance = {
      id: 'attendanceId',
      attended: {},
      date: new Date().getTime(),
      group: group.id,
      teacher: 'teacher1',
    }
    mockDocByPath('organizations/orgId/attendances', attendance)

    render(
      <TestWrapper>
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
})

function defaultMock() {
  const { mockDataByPath } = mockGetDocs()
  const group = {
    teacher: 'teacher1',
    name: 'group 1',
    id: 'g1',
  }
  mockDataByPath('organizations/orgId/groups', [group])
  const student1 = {
    id: 's1',
    name: 'Student name 1',
    groups: [group.id],
  }
  const student2 = {
    id: 's2',
    name: 'Student name 2',
    groups: [group.id],
  }
  mockDataByPath('organizations/orgId/students', [student1, student2])
  const studentsToGroup = [
    {
      id: 's2g1',
      startDate: new Date().getTime() - oneDayInMs,
      endDate: null,
      studentId: student1.id,
    },
    {
      id: 's2g2',
      startDate: new Date().getTime() - treeDaysInMs,
      endDate: null,
      studentId: student2.id,
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

async function selectGroup(id: string) {
  const groupSelect = await screen.findByTestId('group-selector')
  fireEvent.change(groupSelect, { target: { value: id } })
}
