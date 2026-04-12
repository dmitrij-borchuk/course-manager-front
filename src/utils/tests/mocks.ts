import { ModuleMockFactoryWithHelper, ModuleMockOptions } from '@vitest/mocker'
import { vi } from 'vitest'

export function mockFn() {
  return vi.fn()
}

export function mockModule(module: string, factory?: ModuleMockFactoryWithHelper | ModuleMockOptions) {
  vi.mock(module, factory)
}
