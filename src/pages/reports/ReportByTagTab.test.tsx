import { act, render, screen } from '@testing-library/react'
import * as firestore from 'firebase/firestore'
import * as reactPdf from '@react-pdf/renderer'
import userEvent from '@testing-library/user-event'
import { asMock, getFirebaseSnapshotFromArray, TestWrapper } from '../../utils/test'
import { ReportByTagTab } from './ReportByTagTab'
import { Group } from '../../types/group'
import { Attendance } from '../../types/attendance'
import { StudentOfGroup } from '../../types/studentOfGroup'
import { Student } from '../../types/student'
import { resetCache } from '../../store/studentsStore'
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

const { getDocs } = asMock(firestore)
const { usePDF } = asMock(reactPdf)

const { useParams } = jest.requireMock('react-router-dom')

describe('ReportByTagTab', () => {
  beforeEach(() => {
    resetCache()
    resetAttendanceCache()
    useParams.mockReturnValue({
      orgId: 'orgId',
    })
  })
  test('should not fail', async () => {
    getDocs.mockResolvedValue([] as any)
    await act(async () => {
      render(
        <TestWrapper>
          <ReportByTagTab />
        </TestWrapper>
      )
    })
  })
  test('should generate report with sorting', async () => {
    const { attendances, groups, students, studentsOfGroup } = getSortingDataMocks()
    mockGetDocs(groups, studentsOfGroup, attendances, students)
    usePDF.mockReturnValue([{} as any, jest.fn()])

    render(
      <TestWrapper>
        <ReportByTagTab />
      </TestWrapper>
    )

    const tagsEditorInput = await screen.findByLabelText('Tags')
    userEvent.type(tagsEditorInput, 'Lviv{enter}')

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
    expect(persents[1]).toBe('100%')
    expect(persents[2]).toBe('N/A')
  })
  test('should generate report for students with case insensitive tags', async () => {
    const { attendances, groups, students, studentsOfGroup } = getSortingDataMocks()
    mockGetDocs(groups, studentsOfGroup, attendances, students)
    usePDF.mockReturnValue([{} as any, jest.fn()])

    render(
      <TestWrapper>
        <ReportByTagTab />
      </TestWrapper>
    )

    const tagsEditorInput = await screen.findByLabelText('Tags')
    userEvent.type(tagsEditorInput, 'Lviv{enter}')

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

    expect(persents).toHaveLength(4)
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
        s1: false,
        s2: true,
      },
      date: new Date().getTime(),
      group: 'g1',
      teacher: '',
    },
    {
      id: 'a2',
      attended: {
        s1: false,
        s2: true,
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
      id: 's3',
      name: 'st 3',
      tags: ['Lviv'],
    },
    {
      id: 's2',
      name: 'st 2',
      tags: ['Lviv'],
    },
    {
      id: 's1',
      name: 'st 1',
      tags: ['Lviv'],
    },
    {
      id: 's4',
      name: 'st 3',
      tags: ['lviv'],
    },
    {
      id: 's5',
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
