import { renderHook } from '@testing-library/react-hooks'
import { useAttendanceGrouping } from './attendances'

describe('Attendances service', () => {
  test('should return attendances', async () => {
    const date = new Date()
    const { result } = renderHook(() => useAttendanceGrouping(date, date, [], []))

    expect(result.current).toEqual([
      {
        date: date,
        items: [],
      },
    ])
  })
})
