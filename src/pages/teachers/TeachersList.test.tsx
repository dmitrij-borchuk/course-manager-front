import { render, screen } from '@testing-library/react'
import * as reactRouter from 'react-router'
import * as reactRouterDom from 'react-router-dom'
import { asMock, getAxiosMock, mockGetDocs, mockOrgId, TestWrapper } from '../../utils/test'
import { TeachersListPage } from './TeachersList'

vi.mock('react-router-dom')
vi.mock('react-router')

const { useHistory } = asMock(reactRouterDom)
const { useLocation } = asMock(reactRouter)

describe('TeachersListPage', async () => {
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
      pathname: '/teachers',
      state: undefined,
      hash: '',
    })
    axiosMock.onGet('/organizations').reply(200, [{ id: 1, key: 'orgId', name: 'orgName' }])
    axiosMock.onGet('/activities').reply(200, [])
    axiosMock.onGet('/profiles?deleted=false').reply(200, [
      {
        id: 1,
        name: 'Alice Smith',
        role: 'Teacher',
        user: { id: 1, email: 'alice@example.com', outerId: 'u1' },
        createdAt: '2021-10-10',
        deleted: false,
        updatedAt: '2021-10-10',
        organizationId: 1,
        userId: 1,
        updatedBy: 1,
      },
      {
        id: 2,
        name: 'Bob Jones',
        role: 'Teacher',
        user: { id: 2, email: 'bob@example.com', outerId: 'u2' },
        createdAt: '2021-10-10',
        deleted: false,
        updatedAt: '2021-10-10',
        organizationId: 1,
        userId: 2,
        updatedBy: 1,
      },
    ])
  })

  afterEach(() => {
    axiosMock.reset()
  })

  test('filters teachers by filter URL query parameter', async () => {
    useLocation.mockReturnValue({
      search: '?filter=smith',
      pathname: '/teachers',
      state: undefined,
      hash: '',
    })

    render(
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
        <TeachersListPage />
      </TestWrapper>
    )

    expect(await screen.findByText('Alice Smith')).toBeInTheDocument()
    expect(screen.queryByText('Bob Jones')).not.toBeInTheDocument()
  })
})

