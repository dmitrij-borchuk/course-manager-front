import { act, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import * as reactRouterDom from 'react-router-dom'
import { asMock, mockDoc, mockGetDocs, TestWrapper } from '../../utils/test'
import { AttendanceEditorPage } from './AttendanceEditor'

jest.mock('react-materialize', () => ({
  ...jest.requireActual('react-materialize'),
  DatePicker: ({ label, onChange, ...props }: any) => (
    <label>
      {label}
      <input onChange={(e) => onChange(new Date(e.currentTarget.value))} {...props} />
    </label>
  ),
}))

const { useParams } = asMock(reactRouterDom)

// TODO:
// edit should preserve date
// edit should preserve teacher (?)
// test('should not create new instance when edit', async () => {
// edit should show students of the group
// create should show students on the specific date

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
    await act(async () => {
      render(
        <TestWrapper>
          <AttendanceEditorPage />
        </TestWrapper>
      )
    })
  })

  // TODO: rewrite test when new API will be used
  test('while creating should show students assigned at the specific date', async () => {
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

    await act(async () => {
      render(
        <TestWrapper>
          <AttendanceEditorPage />
        </TestWrapper>
      )
    })
    const groupOption = screen.getByTestId('group-selector')
    await act(async () => {
      userEvent.selectOptions(groupOption, group.name)
    })

    // Check that both students are exist
    expect(screen.queryByText(student1.name)).not.toBeNull()
    expect(screen.queryByText(student2.name)).not.toBeNull()

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
    await act(async () => {
      const time = new Date().getTime() - twoDaysInMs
      userEvent.type(datePicker, `${new Date(time).toLocaleDateString()}`)
    })

    // Check that only one student is exist
    expect(screen.queryByText(student1.name)).toBeNull()
    expect(screen.queryByText(student2.name)).not.toBeNull()
  })
})
