import { renderHook, waitFor } from '@testing-library/react'
import * as filteringContext from 'modules/activities/activitiesFilteringContext'
import { useActivitiesData } from './GroupsList'
import { asMock, TestWrapper } from 'utils/test'
import * as attendanceApi from '../../modules/attendance/api'
import * as activitiesApi from '../../modules/activities/api'

jest.mock('../../hooks/useOrgId')
jest.mock('../../modules/attendance/api')
jest.mock('../../modules/activities/api')
jest.mock('modules/activities/activitiesFilteringContext')
jest.mock('react-router-dom', () => ({
  useParams: jest.fn(),
  useHistory: jest.fn(),
}))

const { fetchAttendancesForGroups } = asMock(attendanceApi)
const { fetchActivities } = asMock(activitiesApi)
const { useActivitiesFiltering } = asMock(filteringContext)

describe('useActivitiesData', () => {
  beforeEach(() => {
    localStorage.clear()
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
    useActivitiesFiltering.mockReturnValue({
      filter: { showArchived: false },
      updateFilter: jest.fn(),
      setOpenFilterDialog: jest.fn(),
    })
    const { rerender } = renderHook(() => useActivitiesData(), { wrapper: TestWrapper })
    await waitFor(() => expect(fetchAttendancesForGroups).toHaveBeenCalledWith('orgId', ['1']))

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

    useActivitiesFiltering.mockReturnValue({
      filter: { showArchived: true },
      updateFilter: jest.fn(),
      setOpenFilterDialog: jest.fn(),
    })
    rerender()
    await waitFor(() => expect(fetchAttendancesForGroups).toHaveBeenCalledWith('orgId', ['1', '2']))
  })
})
