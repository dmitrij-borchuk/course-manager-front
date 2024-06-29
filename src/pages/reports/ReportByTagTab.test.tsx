import { fireEvent, render, screen } from '@testing-library/react'
import * as reactPdf from '@react-pdf/renderer'
import userEvent from '@testing-library/user-event'
import * as reportsApi from 'modules/reports/api'
import { asMock, getAxiosMock, TestWrapper } from '../../utils/test'
import { ReportByTagTab } from './ReportByTagTab'
import { AxiosHeaders } from 'axios'

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

const { usePDF } = asMock(reactPdf)
const { getReportByTagRequest } = asMock(reportsApi)

const { useParams } = jest.requireMock('react-router-dom')

describe('ReportByTagTab', () => {
  const axiosMock = getAxiosMock()

  beforeEach(() => {
    useParams.mockReturnValue({
      orgId: 'orgId',
    })
    usePDF.mockReturnValue([{ url: 'url' } as any, jest.fn()])
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
          attended: 0,
          total: 1,
        },
        {
          participantId: 2,
          participantName: 'st 2',
          activityId: 1,
          activityName: 'g1',
          activityOuterId: 'g1',
          rate: 1,
          attended: 1,
          total: 1,
        },
      ],
      status: 200,
      statusText: '',
      headers: {},
      config: {
        headers: new AxiosHeaders(),
      },
    })

    render(
      <TestWrapper>
        <ReportByTagTab />
      </TestWrapper>
    )

    const tagsEditorInput = await screen.findByLabelText('Tags')
    await userEvent.type(tagsEditorInput, 'Lviv{enter}')
    await screen.findByRole('button', { name: 'Lviv' })
    await screen.findByRole('link', { name: 'Download' })
    await screen.findByText('Open in new tab')

    renderPdf()

    const percents = await getPercentsArray()

    expect(percents[0]).toBe('0% (0/1)')
    expect(percents[1]).toBe('100% (1/1)')
  })

  test('should sent request with `to` data one day further then selected', async () => {
    getReportByTagRequest.mockResolvedValue({
      data: [
        {
          participantId: 1,
          participantName: 'st 1',
          activityId: 1,
          activityName: 'g1',
          activityOuterId: 'g1',
          rate: 0,
          attended: 0,
          total: 1,
        },
        {
          participantId: 2,
          participantName: 'st 2',
          activityId: 1,
          activityName: 'g1',
          activityOuterId: 'g1',
          rate: 1,
          attended: 1,
          total: 1,
        },
      ],
      status: 200,
      statusText: '',
      headers: {},
      config: {
        headers: new AxiosHeaders(),
      },
    })

    render(
      <TestWrapper>
        <ReportByTagTab />
      </TestWrapper>
    )

    const datePickerFrom = await screen.findByRole<HTMLInputElement>('textbox', { name: /From/i })
    fireEvent.change(datePickerFrom, { target: { value: '05/20/2022' } })

    const datePickerTo = await screen.findByRole<HTMLInputElement>('textbox', { name: /To/i })
    fireEvent.change(datePickerTo, { target: { value: '05/22/2022' } })

    const tagsEditorInput = await screen.findByLabelText('Tags')
    await userEvent.type(tagsEditorInput, 'Lviv{enter}')

    expect(getReportByTagRequest).toHaveBeenCalled()
    const to = getReportByTagRequest.mock.lastCall?.[1]
    expect(to?.getDate()).toBe(23)
  })

  function renderPdf() {
    expect(usePDF).toHaveBeenCalled()
    const lastCall = usePDF.mock.calls[usePDF.mock.calls.length - 1]
    const document = lastCall[0]?.document
    render(document!)
  }

  async function getPercentsArray() {
    const el = await screen.findAllByTestId('pdf-text')
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
