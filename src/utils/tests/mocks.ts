import { ModuleMockFactoryWithHelper, ModuleMockOptions } from '@vitest/mocker'
import { vi } from 'vitest'

export function mockFn() {
  return vi.fn()
}
