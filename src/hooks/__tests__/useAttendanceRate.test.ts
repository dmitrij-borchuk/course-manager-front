import { renderHook } from '@testing-library/react'
import { useAttendanceRateByGroups, useStudentAttendanceRateByGroups, useAttendanceRateByTeacher, useAttendanceRateByStudent } from '../useAttendanceRate'
import { Activity } from '../../types/activity'
import { Attendance } from '../../types/attendance'

describe('useAttendanceRate', () => {
  const groups: Activity[] = [
    { id: 1, type: 'group', name: 'G1', performerId: null, organization: 1, outerId: 'g1', archived: false, updatedBy: 1, createdAt: '', updatedAt: '' },
    { id: 2, type: 'group', name: 'G2', performerId: null, organization: 1, outerId: 'g2', archived: false, updatedBy: 1, createdAt: '', updatedAt: '' },
    { id: 3, type: 'group', name: 'G3', performerId: null, organization: 1, outerId: 'g3', archived: false, updatedBy: 1, createdAt: '', updatedAt: '' },
  ]
  const attendances: Attendance[] = [
    { id: '1', date: 1, group: 'g1', teacher: 't1', attended: { 's1': true, 's2': false } },
    { id: '2', date: 2, group: 'g1', teacher: 't1', attended: { 's1': true, 's2': true } },
    { id: '3', date: 3, group: 'g2', teacher: 't2', attended: { 's3': false, 's4': false } },
    { id: '4', date: 4, group: 'g3', teacher: 't3', attended: {} } // No students attended
  ]

  describe('useAttendanceRateByGroups', () => {
    it('returns empty object if empty groups passed', () => {
      const { result } = renderHook(() => useAttendanceRateByGroups([], []))
      expect(result.current).toEqual({})
    })

    it('returns null if there are no attendances for the group', () => {
      const { result } = renderHook(() => useAttendanceRateByGroups(groups, []))
      expect(result.current).toEqual({})
    })

    it('calculates average attendance rate by group', () => {
      const { result } = renderHook(() => useAttendanceRateByGroups(groups, attendances))
      // g1 class 1: 1/2 = 0.5
      // g1 class 2: 2/2 = 1
      // g1 average = 0.75
      // g2 class 1: 0/2 = 0
      // g2 average = 0
      // g3 class 1: 0/0 = NaN
      // g3 average = NaN (but getRateOfClass will return NaN, then getAverage returns NaN, which is falsy or null) - let's focus on 0 first
      expect(result.current[1]).toBe(0.75)
      expect(result.current[2]).toBe(0) // This fails currently due to `if (!rate)`
    })
  })

  describe('useStudentAttendanceRateByGroups', () => {
    it('returns empty object if no studentId is passed', () => {
      const { result } = renderHook(() => useStudentAttendanceRateByGroups(undefined, groups, attendances))
      expect(result.current).toEqual({})
    })

    it('calculates attendance rate for a specific student', () => {
      const { result } = renderHook(() => useStudentAttendanceRateByGroups('s1', groups, attendances))
      // s1 in g1 class 1: true
      // s1 in g1 class 2: true
      // s1 in g1 total: 2/2 = 1
      // s1 in g2 total: no attendance recorded, so NaN (handled by isNaN check)
      expect(result.current[1]).toBe(1)
      expect(result.current[2]).toBeUndefined()
    })

    it('calculates attendance rate for a student with 0 rate', () => {
      const { result } = renderHook(() => useStudentAttendanceRateByGroups('s2', groups, attendances))
      // s2 in g1 class 1: false
      // s2 in g1 class 2: true
      // s2 in g1 total: 1/2 = 0.5
      expect(result.current[1]).toBe(0.5)

      const { result: resultS3 } = renderHook(() => useStudentAttendanceRateByGroups('s3', groups, attendances))
      // s3 in g2 class 1: false
      // s3 in g2 total: 0/1 = 0
      expect(resultS3.current[2]).toBe(0)
    })
  })

  describe('useAttendanceRateByTeacher', () => {
    it('calculates average attendance rate by teacher', () => {
      const { result } = renderHook(() => useAttendanceRateByTeacher(attendances))
      // t1 classes: 1/2 (0.5), 2/2 (1.0). Average = 0.75
      // t2 classes: 0/2 (0). Average = 0
      expect(result.current['t1']).toBe(0.75)
      expect(result.current['t2']).toBe(0) // Fails currently
    })
  })

  describe('useAttendanceRateByStudent', () => {
    it('calculates attendance stats for all students', () => {
      const { result } = renderHook(() => useAttendanceRateByStudent(attendances))
      // s1 attended 2, total 2, rate 1
      // s2 attended 1, total 2, rate 0.5
      // s3 attended 0, total 1, rate 0
      // s4 attended 0, total 1, rate 0
      expect(result.current['s1']).toEqual({ rate: 1, attended: 2, total: 2 })
      expect(result.current['s2']).toEqual({ rate: 0.5, attended: 1, total: 2 })
      expect(result.current['s3']).toEqual({ rate: 0, attended: 0, total: 1 })
      expect(result.current['s4']).toEqual({ rate: 0, attended: 0, total: 1 })
    })
  })
})
