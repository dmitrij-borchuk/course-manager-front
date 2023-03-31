import { renderHook } from '@testing-library/react-hooks'
import * as reactRouterDomMock from 'react-router-dom'
import { useData } from './GroupsInfoBlock'
import { asMock, TestWrapper } from 'utils/test'

jest.mock('../../hooks/useOrgId')
jest.mock('react-router-dom', () => ({
  useParams: jest.fn(),
  useHistory: jest.fn(),
}))

const { useParams } = asMock(reactRouterDomMock)

describe('GroupsInfoBlock', () => {
  it('filter state should persist', () => {
    useParams.mockReturnValue({ id: '1' })
    const { result } = renderHook(() => useData(), { wrapper: TestWrapper })
    expect(result.current.filter.showArchived).toBe(false)

    result.current.onFiltersApply({ showArchived: true })
    expect(result.current.filter.showArchived).toBe(true)

    const { result: newRenderResult } = renderHook(() => useData(), { wrapper: TestWrapper })
    expect(newRenderResult.current.filter.showArchived).toBe(true)
  })
})
