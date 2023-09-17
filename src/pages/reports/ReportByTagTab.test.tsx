import { render, screen } from '@testing-library/react'
import * as firestore from 'firebase/firestore'
import * as reactPdf from '@react-pdf/renderer'
import userEvent from '@testing-library/user-event'
import * as reportsApi from 'modules/reports/api'
import { asMock, getAxiosMock, getFirebaseSnapshotFromArray, TestWrapper } from '../../utils/test'
import { ReportByTagTab } from './ReportByTagTab'
import { Group } from '../../types/group'
import { Attendance } from '../../types/attendance'
import { StudentOfGroup } from '../../types/studentOfGroup'
import { Student } from '../../types/student'

jest.mock('modules/reports/api')
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
    BlobProvider: ({ children }: any) => <div>{children({ url: '' })}</div>,
  }
})

const { getDocs } = asMock(firestore)
const { usePDF } = asMock(reactPdf)
const { getReportByTagRequest } = asMock(reportsApi)

const { useParams } = jest.requireMock('react-router-dom')

describe('ReportByTagTab', () => {
  const axiosMock = getAxiosMock()

  beforeEach(() => {
    useParams.mockReturnValue({
      orgId: 'orgId',
    })
    usePDF.mockReturnValue([{} as any, jest.fn()])
    axiosMock.onGet('/organizations').reply(200, [
      {
        id: 1,
        key: 'orgId',
        name: 'orgName',
      },
    ])
  })

  afterEach(() => {
    axiosMock.reset()
  })
  test('should generate report with sorting', async () => {
    getReportByTagRequest.mockResolvedValue({
      data: [
        {
          participantId: 1,
          participantName: 'st 1',
          activityId: 1,
          activityName: 'g1',
          activityOuterId: 'g1',
          rate: 0,
        },
        {
          participantId: 2,
          participantName: 'st 2',
          activityId: 1,
          activityName: 'g1',
          activityOuterId: 'g1',
          rate: 1,
        },
      ],
      status: 200,
      statusText: '',
      headers: {},
      config: {},
    })

    render(
      <TestWrapper>
        <ReportByTagTab />
      </TestWrapper>
    )

    const tagsEditorInput = await screen.findByLabelText('Tags')
    userEvent.type(tagsEditorInput, 'Lviv{enter}')
    await screen.findByText('Open in new tab')

    renderPdf()

    const percents = await getPercentsArray()

    expect(percents[0]).toBe('0%')
    expect(percents[1]).toBe('100%')
  })

  function renderPdf() {
    expect(usePDF).toBeCalled()
    const lastCall = usePDF.mock.calls[usePDF.mock.calls.length - 1]
    const document = lastCall[0].document
    render(document)
  }

  async function getPercentsArray() {
    const el = await screen.findAllByTestId('pdf-text')
    const t = el.map((e) => e.textContent)
    return (
      el
        // Get text
        .map((e) => e.textContent)
        // Remove header
        .splice(1)
        // Filter out student names
        .filter((e, i) => i % 3 === 2)
    )
  }
})
