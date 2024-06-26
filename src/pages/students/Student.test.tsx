import { render, screen, waitForElementToBeRemoved } from '@testing-library/react'
import { getAxiosMock, mockGetDocs, mockUrlParams, TestWrapper } from '../../utils/test'
import { createFirebaseMock } from '../../utils/tests/firebaseMock'
import StudentPage from './Student'

describe('Student', () => {
  let getDocs!: ReturnType<typeof mockGetDocs>
  const axiosMock = getAxiosMock()
  beforeEach(() => {
    getDocs = mockGetDocs()
  })

  afterEach(() => {
    axiosMock.reset()
  })

  test('should omit attendance without student in calculation', async () => {
    makeDefaultMock()
    render(
      <TestWrapper
        initialState={{
          organizations: {
            list: {
              loading: false,
              data: [
                {
                  id: 1,
                  key: 'orgId',
                },
              ],
            },
            currentOrg: {
              loading: false,
              data: {
                id: 1,
                key: 'orgId',
              },
            },
          },
        }}
      >
        <StudentPage />
      </TestWrapper>
    )

    await screen.findByText('studentName')
    const rates = await screen.findAllByTestId('attendance-rate-badge')
    const rate = rates[0]
    expect(rate).toHaveTextContent('50%')
  })

  test.skip('should create an instance', async () => {
    jest.setSystemTime(new Date('2020-04-01'))
    mockUrlParams({ orgId: 'orgId', id: '1' })
    const fbMock = createFirebaseMock()
    axiosMock.onGet('/organizations').reply(200, [
      {
        key: 'orgId',
        id: 1,
      },
    ])
    axiosMock.onGet(`/students/1?orgId=1`).reply(200, { id: 1, name: 'name', outerId: 'outerId' })
    fbMock.mockDataByPath('organizations/orgId/groups', [
      {
        id: 'groupId',
        name: 'group',
      },
      {
        id: 'groupId2',
        name: 'group 2',
      },
    ])
    fbMock.mockDataByPath('organizations/orgId/studentsToGroups', [
      {
        id: 'st2groupId',
        groupId: 'groupId',
        studentId: 'outerId',
        startDate: new Date('2020-01-01').getTime(),
        endDate: new Date('2020-02-01').getTime(),
      },
      {
        id: 'st2groupId2',
        groupId: 'groupId2',
        studentId: 'outerId',
        startDate: new Date('2020-01-01').getTime(),
        endDate: null,
      },
      {
        id: 'st2groupId3',
        groupId: 'groupId2',
        studentId: 'outerId2',
        startDate: new Date('2020-01-01').getTime(),
        endDate: null,
      },
    ])

    render(
      <TestWrapper>
        <StudentPage />
      </TestWrapper>
    )

    const loader = screen.queryByTestId('preloader')
    await waitForElementToBeRemoved(loader)

    await screen.findByTestId('attendance-rate-badge')
  })

  function makeDefaultMock() {
    mockUrlParams({
      id: '1',
      orgId: 'orgId',
    })
    getDocs.mockDataByPath('organizations/orgId/attendances', [
      {
        id: 'attendance1',
        attended: {
          st1: true,
          st2: true,
          st3: false,
        },
        group: 'group1',
      },
      {
        id: 'attendance2',
        attended: {
          st1: true,
          st2: false,
          st3: true,
        },
        group: 'group2',
      },
      {
        id: 'attendance3',
        attended: {
          st1: false,
          st2: true,
          st3: true,
        },
        group: 'group1',
      },
      {
        id: 'attendance4',
        attended: {
          st2: true,
          st3: true,
        },
        group: 'group1',
      },
    ])
    const from = new Date()
    from.setMonth(from.getMonth() - 1)

    axiosMock.onGet('/activities').reply(200, [
      {
        id: 1,
        outerId: 'group1',
        name: 'group name',
        performerId: 1,
        studentsToActivities: [],
      },
    ])
    axiosMock.onGet('/organizations').reply(200, [
      {
        id: 1,
        key: 'orgId',
        name: 'orgName',
      },
    ])
    axiosMock.onGet(`/users/byOuterId/1/teacherId`).reply(200, {
      id: 1,
      name: 'orgName',
      email: 'email',
      outerId: 'teacherId',
    })
    axiosMock.onGet(`/users/1`).reply(200, [
      {
        id: 1,
        name: 'orgName',
        email: 'email',
        outerId: 'teacherId',
      },
    ])
    axiosMock.onGet(`/students/1`).reply(200, { id: 1, name: 'studentName', outerId: 'st1' })
    axiosMock.onGet(`/activities/participation`).reply(200, [
      {
        id: 1,
        activity: {
          id: 1,
          name: 'group name',
          performerId: 1,
          type: 'group',
          outerId: 'group1',
          deleted: false,
          archived: false,
        },
        startDate: '2022-07-24T13:45:32.482Z',
        endDate: null,
        participantId: 1,
      },
    ])
  }
})
