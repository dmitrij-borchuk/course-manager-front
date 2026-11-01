import { render, screen, waitFor } from '@testing-library/react'
import * as reactRouter from 'react-router'
import * as reactRouterDom from 'react-router-dom'
import { asMock, getAxiosMock, mockGetDocs, mockOrgId, TestWrapper } from '../../utils/test'
import { StudentListPage } from './StudentList'

vi.mock('react-router-dom')
vi.mock('react-router')

const { useHistory } = asMock(reactRouterDom)
const { useLocation } = asMock(reactRouter)

describe('StudentListPage', async () => {
  const axiosMock = await getAxiosMock()

  beforeEach(() => {
    mockOrgId('orgId')
    mockGetDocs()
    useHistory.mockReturnValue({
      push: vi.fn(),
      replace: vi.fn(),
      location: { search: '' },
    } as unknown as ReturnType<typeof reactRouterDom.useHistory>)
    useLocation.mockReturnValue({
      search: '',
      pathname: '/students',
      state: undefined,
      hash: '',
    })
    axiosMock.onGet('/organizations').reply(200, [{ id: 1, key: 'orgId', name: 'orgName' }])
    axiosMock.onGet('/activities').reply(200, [])
  })

  afterEach(() => {
    axiosMock.reset()
  })

  test('fetches students with empty filter when URL has no filter query parameter', async () => {
    axiosMock.onGet('/students', { params: { filter: '' } }).reply(200, [
      { id: 1, name: 'Alice', outerId: 's1', tags: [] },
      { id: 2, name: 'Bob', outerId: 's2', tags: [] },
    ])

    render(<Component />)

    expect(await screen.findByText('Alice')).toBeInTheDocument()
    expect(await screen.findByText('Bob')).toBeInTheDocument()
  })

  test('fetches students with filter query parameter from URL and renders returned items directly', async () => {
    useLocation.mockReturnValue({
      search: '?filter=john',
      pathname: '/students',
      state: undefined,
      hash: '',
    })

    axiosMock.onGet('/students', { params: { filter: 'john' } }).reply(200, [
      { id: 1, name: 'John Doe', outerId: 's1', tags: [] },
      { id: 2, name: 'Unmatched Name From Backend', outerId: 's2', tags: [] },
    ])

    render(<Component />)

    expect(await screen.findByText('John Doe')).toBeInTheDocument()
    expect(await screen.findByText('Unmatched Name From Backend')).toBeInTheDocument()

    await waitFor(() => {
      const studentRequests = axiosMock.history.get.filter((req) => req.url === '/students')
      expect(studentRequests).toHaveLength(1)
      expect(studentRequests[0].params).toEqual({ filter: 'john' })
    })
  })
})

function Component() {
  return (
    <TestWrapper
      initialState={{
        organizations: {
          list: {
            loading: false,
            data: [{ id: 1, key: 'orgId' }],
          },
          currentOrg: {
            loading: false,
            data: { id: 1, key: 'orgId' },
          },
        },
      }}
    >
      <StudentListPage />
    </TestWrapper>
  )
}
