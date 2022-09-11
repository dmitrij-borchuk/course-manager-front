import { act, render, screen } from '@testing-library/react'
import * as firestore from 'firebase/firestore'
import * as reactPdf from '@react-pdf/renderer'
import userEvent from '@testing-library/user-event'
import { asMock, getFirebaseSnapshotFromArray, TestWrapper } from '../../utils/test'
import { ReportByGroupTab } from './ReportByGroupTab'
import { Group } from '../../types/group'
import { Attendance } from '../../types/attendance'
import { StudentOfGroup } from '../../types/studentOfGroup'
import { Student } from '../../types/student'
import { resetAttendanceCache } from '../../store/attendancesStore'

jest.mock('react-router-dom', () => {
  return {
    useParams: jest.fn(),
    useHistory: jest.fn(),
  }
})
jest.mock('@react-pdf/renderer', () => {
  return {
    usePDF: jest.fn(),
    Page: ({ children }: any) => <div>Page{children}</div>,
    Text: ({ children }: any) => <div data-testid="pdf-text">{children}</div>,
    View: ({ children }: any) => <div>View{children}</div>,
    Document: ({ children }: any) => <div>Document{children}</div>,
    StyleSheet: {
      create: () => ({}),
    },
  }
})

jest.mock('react-materialize', () => ({
  ...jest.requireActual('react-materialize'),
  DatePicker: ({ label, onChange, ...props }: any) => (
    <label>
      {label}
      <input onChange={(e) => onChange(new Date(e.currentTarget.value))} {...props} />
    </label>
  ),
  Button: (props: any) => <button {...props} />,
}))

const { getDocs } = asMock(firestore)
const { usePDF } = asMock(reactPdf)

const { useParams } = jest.requireMock('react-router-dom')

describe('ReportByGroupTab', () => {
  beforeEach(() => {
    resetAttendanceCache()
    useParams.mockReturnValue({
      orgId: 'orgId',
    })
    localStorage.clear()
  })
  test('should generate report with sorting', async () => {
    const { attendances, groups, students, studentsOfGroup } = getSortingDataMocks()
    mockGetDocs(groups, studentsOfGroup, attendances, students)
    usePDF.mockReturnValue([{ url: 'instance.url' } as any, jest.fn()])

    render(
      <TestWrapper>
        <ReportByGroupTab />
      </TestWrapper>
    )

    await screen.findByRole('button', { name: 'Generate report' })
    const lastCall = usePDF.mock.calls[usePDF.mock.calls.length - 1]
    const document = lastCall[0].document
    render(document)

    const el = await screen.findAllByTestId('pdf-text')
    const persents = el
      // Remove header
      .splice(1)
      // Filter out student names
      .filter((e, i) => i % 2 === 1)
      // Get text
      .map((e) => e.textContent)

    expect(persents[0]).toBe('0%')
    expect(persents[1]).toBe('50%')
    expect(persents[2]).toBe('100%')
  })
  test('should generate report with desc sorting', async () => {
    const { attendances, groups, students, studentsOfGroup } = getSortingDataMocks()
    mockGetDocs(groups, studentsOfGroup, attendances, students)
    usePDF.mockReturnValue([{} as any, jest.fn()])

    render(
      <TestWrapper>
        <ReportByGroupTab />
      </TestWrapper>
    )

    const sortOrderSelector = await screen.findByLabelText('Sort order')
    userEvent.selectOptions(sortOrderSelector, 'Descending')

    const lastCall = usePDF.mock.calls[usePDF.mock.calls.length - 1]
    const document = lastCall[0].document
    render(document)

    const el = await screen.findAllByTestId('pdf-text')
    const persents = el
      // Remove header
      .splice(1)
      // Filter out student names
      .filter((e, i) => i % 2 === 1)
      // Get text
      .map((e) => e.textContent)

    expect(persents[0]).toBe('100%')
    expect(persents[1]).toBe('50%')
    expect(persents[2]).toBe('0%')
  })
  test('should render attendance rate as integer', async () => {
    const groups: Group[] = [
      {
        id: 'g1',
        name: 'g1',
      },
    ]
    const attendances: Attendance[] = [
      {
        id: 'a1',
        attended: {
          s1: true,
        },
        date: new Date().getTime(),
        group: 'g1',
        teacher: '',
      },
      {
        id: 'a2',
        attended: {
          s1: false,
        },
        date: new Date().getTime(),
        group: 'g1',
        teacher: '',
      },
      {
        id: 'a3',
        attended: {
          s1: false,
        },
        date: new Date().getTime(),
        group: 'g1',
        teacher: '',
      },
    ]
    const studentsOfGroup: StudentOfGroup[] = [
      {
        id: 'g1',
        endDate: null,
        groupId: 'g1',
        startDate: new Date().getTime(),
        studentId: 's1',
      },
      {
        id: 'g1s2',
        endDate: null,
        groupId: 'g1',
        startDate: new Date().getTime(),
        studentId: 's2',
      },
    ]
    const students: Student[] = [
      {
        id: 's1',
        name: 'st 1',
      },
      {
        id: 's2',
        name: 'st 1',
      },
    ]
    mockGetDocs(groups, studentsOfGroup, attendances, students)
    usePDF.mockReturnValue([{ url: 'url' } as any, jest.fn()])

    render(
      <TestWrapper>
        <ReportByGroupTab />
      </TestWrapper>
    )

    await screen.findByRole('button', { name: 'Generate report' })
    const lastCall = usePDF.mock.calls[usePDF.mock.calls.length - 1]
    const document = lastCall[0].document
    render(document)

    const el = await screen.findAllByTestId('pdf-text')
    const persents = el
      // Remove header
      .splice(1)
      // Filter out student names
      .filter((e, i) => i % 2 === 1)
      // Get text
      .map((e) => e.textContent)

    expect(persents[0]).toBe('33%')
    expect(persents[1]).toBe('N/A')
  })
  test('should render attendance rate between dates', async () => {
    const groups: Group[] = [
      {
        id: 'g1',
        name: 'g1',
      },
    ]
    const attendances: Attendance[] = [
      {
        id: 'a1',
        attended: {
          s1: false,
          s2: true,
        },
        date: new Date('Wed May 15 2022 19:00:00').getTime(),
        group: 'g1',
        teacher: '',
      },
      {
        id: 'a2',
        attended: {
          s1: true,
          s2: false,
        },
        date: new Date('Wed May 20 2022 19:00:00').getTime(),
        group: 'g1',
        teacher: '',
      },
      {
        id: 'a3',
        attended: {
          s1: false,
          s2: true,
        },
        date: new Date('Wed May 25 2022 19:00:00').getTime(),
        group: 'g1',
        teacher: '',
      },
    ]
    const studentsOfGroup: StudentOfGroup[] = [
      {
        id: 'g1',
        endDate: null,
        groupId: 'g1',
        startDate: new Date('Wed May 10 2022 19:00:00').getTime(),
        studentId: 's1',
      },
      {
        id: 'g1s2',
        endDate: null,
        groupId: 'g1',
        startDate: new Date('Wed May 10 2022 19:00:00').getTime(),
        studentId: 's2',
      },
    ]
    const students: Student[] = [
      {
        id: 's1',
        name: 'st 1',
      },
      {
        id: 's2',
        name: 'st 2',
      },
    ]
    mockGetDocs(groups, studentsOfGroup, attendances, students)
    usePDF.mockReturnValue([{} as any, jest.fn()])

    render(
      <TestWrapper>
        <ReportByGroupTab />
      </TestWrapper>
    )

    const datePickerFrom = await screen.findByLabelText(/From/i)
    userEvent.type(datePickerFrom, `${new Date('Wed May 17 2022 19:00:00').toLocaleDateString()}`)
    const datePickerTo = await screen.findByLabelText(/To/i)
    userEvent.type(datePickerTo, `${new Date('Wed May 22 2022 19:00:00').toLocaleDateString()}`)

    const lastCall = usePDF.mock.calls[usePDF.mock.calls.length - 1]
    const document = lastCall[0].document
    render(document)

    const el = await screen.findAllByTestId('pdf-text')
    const persents = el
      // Remove header
      .splice(1)
      // Get text
      .map((e) => e.textContent)

    expect(persents[0]).toBe('st 2')
    expect(persents[1]).toBe('0%')
    expect(persents[2]).toBe('st 1')
    expect(persents[3]).toBe('100%')
  })
})

function mockGetDocs(
  groups: Group[],
  studentsOfGroup: StudentOfGroup[],
  attendances: Attendance[],
  students: Student[]
) {
  getDocs.mockImplementation((query) => {
    const path = query as unknown as string
    if (path === 'organizations/orgId/groups') {
      return Promise.resolve(getFirebaseSnapshotFromArray(groups))
    }
    if (path === 'organizations/orgId/studentsToGroups') {
      return Promise.resolve(getFirebaseSnapshotFromArray(studentsOfGroup))
    }
    if (path === 'organizations/orgId/attendances') {
      return Promise.resolve(getFirebaseSnapshotFromArray(attendances))
    }
    if (path === 'organizations/orgId/students') {
      return Promise.resolve(getFirebaseSnapshotFromArray(students))
    }
    return Promise.resolve(getFirebaseSnapshotFromArray([]))
  })
}

function getSortingDataMocks() {
  const groups: Group[] = [
    {
      id: 'g1',
      name: 'g1',
    },
  ]
  const attendances: Attendance[] = [
    {
      id: 'a1',
      attended: {
        s1: true,
        s2: false,
        s3: true,
      },
      date: new Date().getTime(),
      group: 'g1',
      teacher: '',
    },
    {
      id: 'a2',
      attended: {
        s1: true,
        s2: false,
        s3: false,
      },
      date: new Date().getTime(),
      group: 'g1',
      teacher: '',
    },
  ]
  const studentsOfGroup: StudentOfGroup[] = [
    {
      id: 'g1',
      endDate: null,
      groupId: 'g1',
      startDate: new Date().getTime(),
      studentId: 's1',
    },
    {
      id: 'g11',
      endDate: null,
      groupId: 'g1',
      startDate: new Date().getTime(),
      studentId: 's2',
    },
    {
      id: 'g12',
      endDate: null,
      groupId: 'g1',
      startDate: new Date().getTime(),
      studentId: 's3',
    },
  ]
  const students: Student[] = [
    {
      id: 's1',
      name: 'st 1',
    },
    {
      id: 's2',
      name: 'st 2',
    },
    {
      id: 's3',
      name: 'st 3',
    },
  ]

  return {
    groups,
    attendances,
    studentsOfGroup,
    students,
  }
}
