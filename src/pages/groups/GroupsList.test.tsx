import { renderHook } from '@testing-library/react-hooks'
import { useActivitiesData } from './GroupsList'
import { asMock, TestWrapper } from 'utils/test'
import * as attendanceApi from '../../modules/attendance/api'
import * as activitiesApi from '../../modules/activities/api'

jest.mock('../../hooks/useOrgId')
jest.mock('../../modules/attendance/api')
jest.mock('../../modules/activities/api')
jest.mock('react-router-dom', () => ({
  useParams: jest.fn(),
  useHistory: jest.fn(),
}))

const { fetchAttendancesForGroups } = asMock(attendanceApi)
const { fetchActivities } = asMock(activitiesApi)

describe('useActivitiesData', () => {
  beforeEach(() => {
    localStorage.clear()
  })
  it('filter state should persist', async () => {
    const { result, waitForNextUpdate } = renderHook(() => useActivitiesData(), { wrapper: TestWrapper })
    expect(result.current.filter.showArchived).toBe(false)
    await waitForNextUpdate()

    result.current.updateFilter({ showArchived: true })
    expect(result.current.filter.showArchived).toBe(true)

    const { result: newRenderResult } = renderHook(() => useActivitiesData(), { wrapper: TestWrapper })
    expect(newRenderResult.current.filter.showArchived).toBe(true)
  })

  it('should refetch attendance after groups are changed', async () => {
    fetchActivities.mockResolvedValue({
      data: [
        {
          id: 1,
          name: 'Activity 1',
          archived: false,
          organization: 1,
          createdAt: '2021-01-01',
          updatedAt: '2021-01-01',
          outerId: '1',
          performerId: 1,
          type: 'group',
          updatedBy: 1,
        },
      ],
    } as any)
    const { result, waitForNextUpdate } = renderHook(() => useActivitiesData(), { wrapper: TestWrapper })
    expect(result.current.filter.showArchived).toBe(false)
    await waitForNextUpdate()
    expect(fetchAttendancesForGroups).toBeCalledWith('orgId', ['1'])

    fetchActivities.mockResolvedValue({
      data: [
        {
          id: 1,
          name: 'Activity 1',
          archived: false,
          organization: 1,
          createdAt: '2021-01-01',
          updatedAt: '2021-01-01',
          outerId: '1',
          performerId: 1,
          type: 'group',
          updatedBy: 1,
        },
        {
          id: 2,
          name: 'Activity 2',
          archived: false,
          organization: 2,
          createdAt: '2021-01-01',
          updatedAt: '2021-01-01',
          outerId: '2',
          performerId: 2,
          type: 'group',
          updatedBy: 2,
        },
      ],
    } as any)
    result.current.updateFilter({ showArchived: true })
    expect(result.current.filter.showArchived).toBe(true)

    await waitForNextUpdate()
    expect(fetchAttendancesForGroups).toBeCalledWith('orgId', ['1', '2'])
    const { result: newRenderResult } = renderHook(() => useActivitiesData(), { wrapper: TestWrapper })
    expect(newRenderResult.current.filter.showArchived).toBe(true)
  })
})
