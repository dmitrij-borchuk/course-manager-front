import { renderHook, act } from '@testing-library/react'
import { useToggle } from './useToggle'

describe('useToggle', () => {
  it('should initialize with the correct value', () => {
    const { result } = renderHook(() => useToggle(true))
    expect(result.current[0]).toBe(true)
    expect(typeof result.current[1].on).toBe('function')
    expect(typeof result.current[1].off).toBe('function')
    expect(typeof result.current[1].toggle).toBe('function')
  })

  it('should toggle the value', () => {
    const { result } = renderHook(() => useToggle(false))
    expect(result.current[0]).toBe(false)

    act(() => {
      result.current[1].toggle()
    })
    expect(result.current[0]).toBe(true)

    act(() => {
      result.current[1].toggle()
    })
    expect(result.current[0]).toBe(false)
  })

  it('should set the value to true with on()', () => {
    const { result } = renderHook(() => useToggle(false))
    expect(result.current[0]).toBe(false)

    act(() => {
      result.current[1].on()
    })
    expect(result.current[0]).toBe(true)

    act(() => {
      result.current[1].on()
    })
    expect(result.current[0]).toBe(true)
  })

  it('should set the value to false with off()', () => {
    const { result } = renderHook(() => useToggle(true))
    expect(result.current[0]).toBe(true)

    act(() => {
      result.current[1].off()
    })
    expect(result.current[0]).toBe(false)

    act(() => {
      result.current[1].off()
    })
    expect(result.current[0]).toBe(false)
  })
})
