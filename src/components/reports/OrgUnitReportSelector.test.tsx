import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import { OrgUnitReportSelector } from 'components/reports/OrgUnitReportSelector'
import * as api from 'api/organizationUnits'

jest.mock('api/organizationUnits')
const mockedApi = api as jest.Mocked<typeof api>

const units = [
  { id: 'unit-1', name: 'Engineering', parentId: null, sortOrder: 0, archivedAt: null, organizationId: 1 },
  { id: 'unit-2', name: 'Sales', parentId: null, sortOrder: 1, archivedAt: null, organizationId: 1 },
]

describe('OrgUnitReportSelector', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockedApi.getOrgUnitsRequest.mockResolvedValue({ data: units } as any)
  })

  it('renders unit options from API', async () => {
    render(
      <OrgUnitReportSelector
        value=""
        includeDescendants={false}
        onChange={jest.fn()}
        disabled={false}
      />
    )
    await waitFor(() => {
      expect(screen.getByRole('option', { name: 'Engineering' })).toBeInTheDocument()
      expect(screen.getByRole('option', { name: 'Sales' })).toBeInTheDocument()
    })
  })

  it('shows includeDescendants checkbox when a unit is selected', async () => {
    render(
      <OrgUnitReportSelector
        value="unit-1"
        includeDescendants={false}
        onChange={jest.fn()}
        disabled={false}
      />
    )
    await waitFor(() => screen.getByLabelText(/include sub-units/i))
  })

  it('does not show includeDescendants checkbox when no unit is selected', async () => {
    render(
      <OrgUnitReportSelector
        value=""
        includeDescendants={false}
        onChange={jest.fn()}
        disabled={false}
      />
    )
    await waitFor(() => units) // wait for load
    expect(screen.queryByLabelText(/include sub-units/i)).toBeNull()
  })
})
