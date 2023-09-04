import { render, screen } from '@testing-library/react'
import * as firestore from 'firebase/firestore'
import * as reactPdf from '@react-pdf/renderer'
import userEvent from '@testing-library/user-event'
import { asMock, getAxiosMock, getFirebaseSnapshotFromArray, TestWrapper } from '../../utils/test'
import { clearAttendanceByGroupCache } from 'modules/attendance/api'
import { ReportByGroupTab } from './ReportByGroupTab'
import { Attendance } from '../../types/attendance'
import { Student } from '../../types/student'
import { Activity } from '../../types/activity'

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
  const axiosMock = getAxiosMock()

  beforeEach(() => {
    clearAttendanceByGroupCache()
    useParams.mockReturnValue({
      orgId: 'orgId',
    })
    localStorage.clear()
    usePDF.mockReturnValue([{ url: 'instance.url' } as any, jest.fn()])
    axiosMock.onGet('/organizations').reply(200, [
      {
        id: 1,
        key: 'orgId',
      },
    ])
  })

  afterEach(() => {
    axiosMock.reset()
  })

  test('should generate report with sorting', async () => {
    const { attendances, groups, students } = getSortingDataMocks()
    mockGetDocs(attendances)
    axiosMock.onGet(`/activities`).reply(200, groups)
    groups.forEach((g) => {
      axiosMock.onGet(new RegExp(`/students/byActivity/${g.id}`)).reply(200, students)
    })
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
    const { attendances, groups, students } = getSortingDataMocks()
    mockGetDocs(attendances)
    axiosMock.onGet(`/activities`).reply(200, groups)
    groups.forEach((g) => {
      axiosMock.onGet(new RegExp(`/students/byActivity/${g.id}`)).reply(200, students)
    })
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
    const groups: Activity[] = [
      {
        id: 1,
        name: 'g1',
        createdAt: new Date().toISOString(),
        organization: 1,
        outerId: 'g1',
        performerId: 1,
        type: 'group',
        updatedAt: new Date().toISOString(),
        updatedBy: 1,
        archived: false,
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
    const students: Student[] = [
      {
        id: 1,
        outerId: 's1',
        name: 'st 1',
        tags: [],
      },
      {
        id: 2,
        outerId: 's2',
        name: 'st 1',
        tags: [],
      },
    ]
    mockGetDocs(attendances)
    usePDF.mockReturnValue([{ url: 'url' } as any, jest.fn()])
    axiosMock.onGet(`/activities`).reply(200, groups)
    groups.forEach((g) => {
      axiosMock.onGet(new RegExp(`/students/byActivity/${g.id}`)).reply(200, students)
    })

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
  })
  test('should render attendance rate between dates', async () => {
    const groups: Activity[] = [
      {
        id: 1,
        name: 'g1',
        createdAt: new Date().toISOString(),
        organization: 1,
        outerId: 'g1',
        performerId: 1,
        type: 'group',
        updatedAt: new Date().toISOString(),
        updatedBy: 1,
        archived: false,
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
    const students: Student[] = [
      {
        id: 1,
        outerId: 's1',
        name: 'st 1',
        tags: [],
      },
      {
        id: 2,
        outerId: 's2',
        name: 'st 2',
        tags: [],
      },
    ]
    mockGetDocs(attendances)
    usePDF.mockReturnValue([{} as any, jest.fn()])
    axiosMock.onGet(`/activities`).reply(200, groups)
    groups.forEach((g) => {
      axiosMock.onGet(new RegExp(`/students/byActivity/${g.id}`)).reply(200, students)
    })

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

  test('should show report only related to group selected', async () => {
    const { attendances, groups, students } = getGroupsFilteringData()
    mockGetDocs(attendances)
    axiosMock.onGet(`/activities`).reply(200, groups)
    groups.forEach((g) => {
      axiosMock.onGet(new RegExp(`/students/byActivity/${g.id}`)).reply(200, students)
    })

    render(
      <TestWrapper>
        <ReportByGroupTab />
      </TestWrapper>
    )

    await screen.findByRole('button', { name: 'Generate report' })
    renderPdf()
    const percents = await getPercentsArray()

    expect(percents[0]).toBe('50%')
  })

  test('should show report for any group', async () => {
    const { attendances, groups, students } = getGroupsFilteringData()
    mockGetDocs(attendances)
    axiosMock.onGet(`/activities`).reply(200, groups)
    groups.forEach((g) => {
      axiosMock.onGet(new RegExp(`/students/byActivity/${g.id}`)).reply(200, students)
    })

    render(
      <TestWrapper>
        <ReportByGroupTab />
      </TestWrapper>
    )

    const groupSelector = await screen.findByLabelText('Group')
    userEvent.selectOptions(groupSelector, groups[1].id.toString())

    await screen.findByRole('button', { name: 'Generate report' })
    renderPdf()
    const title = await getReportTitle()

    expect(title.textContent).toBe(groups[1].name)
  })

  function renderPdf() {
    expect(usePDF).toBeCalled()
    const lastCall = usePDF.mock.calls[usePDF.mock.calls.length - 1]
    const document = lastCall[0].document
    render(document)
  }

  async function getPercentsArray() {
    const el = await screen.findAllByTestId('pdf-text')
    return (
      el
        // Remove header
        .splice(1)
        // Filter out student names
        .filter((e, i) => i % 2 === 1)
        // Get text
        .map((e) => e.textContent)
    )
  }
})

function mockGetDocs(attendances: Attendance[]) {
  getDocs.mockImplementation((query) => {
    const path = query as unknown as string
    if (path === 'organizations/orgId/attendances') {
      return Promise.resolve(getFirebaseSnapshotFromArray(attendances))
    }
    return Promise.resolve(getFirebaseSnapshotFromArray([]))
  })
}

function getSortingDataMocks() {
  const groups: Activity[] = [
    {
      id: 1,
      name: 'g1',
      createdAt: new Date().toISOString(),
      organization: 1,
      outerId: 'g1',
      performerId: 1,
      type: 'group',
      updatedAt: new Date().toISOString(),
      updatedBy: 1,
      archived: false,
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
  const students: Student[] = [
    {
      id: 1,
      outerId: 's1',
      name: 'st 1',
      tags: [],
    },
    {
      id: 2,
      outerId: 's2',
      name: 'st 2',
      tags: [],
    },
    {
      id: 3,
      outerId: 's3',
      name: 'st 3',
      tags: [],
    },
  ]

  return {
    groups,
    attendances,
    students,
  }
}

function getGroupsFilteringData() {
  const groups: Activity[] = [
    {
      id: 1,
      name: 'g1',
      createdAt: new Date().toISOString(),
      organization: 1,
      outerId: 'g1',
      performerId: 1,
      type: 'group',
      updatedAt: new Date().toISOString(),
      updatedBy: 1,
      archived: false,
    },
    {
      id: 2,
      name: 'g2',
      createdAt: new Date().toISOString(),
      organization: 1,
      outerId: 'g1',
      performerId: 1,
      type: 'group',
      updatedAt: new Date().toISOString(),
      updatedBy: 1,
      archived: false,
    },
  ]
  const attendances: Attendance[] = [
    {
      id: 'a1',
      attended: {
        s1: false,
      },
      date: new Date().getTime(),
      group: 'g1',
      teacher: '',
    },
    {
      id: 'a2',
      attended: {
        s1: true,
      },
      date: new Date().getTime(),
      group: 'g1',
      teacher: '',
    },
    {
      id: 'a3',
      attended: {
        s1: true,
      },
      date: new Date().getTime(),
      group: 'g2',
      teacher: '',
    },
  ]
  const students: Student[] = [
    {
      id: 1,
      outerId: 's1',
      name: 'st 1',
      tags: ['Lviv'],
    },
  ]

  return {
    groups,
    attendances,
    students,
  }
}

async function getReportTitle() {
  const el = await screen.findAllByTestId('pdf-text')
  return el[0]
}
