import { act, renderHook } from '@testing-library/react-hooks'
import { ActivitiesFilteringProvider, useActivitiesFiltering } from './activitiesFilteringContext'

describe('useActivitiesFiltering', () => {
  beforeEach(() => {
    localStorage.clear()
  })
  it('filter state should persist', async () => {
    const { result } = renderHook(() => useActivitiesFiltering(), {
      wrapper: ActivitiesFilteringProvider,
    })
    expect(result.current.filter.showArchived).toBe(false)

    act(() => result.current.updateFilter({ showArchived: true }))
    expect(result.current.filter.showArchived).toBe(true)

    const { result: newRenderResult } = renderHook(() => useActivitiesFiltering(), {
      wrapper: ActivitiesFilteringProvider,
    })
    expect(newRenderResult.current.filter.showArchived).toBe(true)
  })
})
