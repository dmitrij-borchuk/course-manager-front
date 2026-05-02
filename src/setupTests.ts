// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom'
import 'materialize-css'
import MockIntersectionObserver from 'utils/tests/MockIntersectionObserver'
import { vi } from 'vitest'
import MockAdapter from 'axios-mock-adapter'

window.IntersectionObserver = MockIntersectionObserver

vi.mock(import('axios'), async (importOriginal) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const actual: any = await importOriginal()
  // const axios: any = await import('axios')
  const mock = new MockAdapter(actual)
  return {
    default: actual,
    ...actual,
    mock,
  }
})

vi.mock('firebase/firestore')
vi.mock('firebase/auth')
vi.mock('firebase/analytics')
