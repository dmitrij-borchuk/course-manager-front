import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { OrgUnitTreeManager } from 'components/organizations/OrgUnitTreeManager'
import * as api from 'api/organizationUnits'

jest.mock('api/organizationUnits')
const mockedApi = api as jest.Mocked<typeof api>

const emptyTree = { data: [] }
const treeWithRoot = {
  data: [
    {
      id: 'unit-1',
      name: 'Engineering',
      parentId: null,
      sortOrder: 0,
      archivedAt: null,
      organizationId: 1,
      children: [],
    },
  ],
}

describe('OrgUnitTreeManager', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    mockedApi.getOrgUnitTreeRequest.mockResolvedValue(emptyTree as any)
  })

  it('shows loading state initially', () => {
    render(<OrgUnitTreeManager />)
    expect(screen.getByText(/loading organizational tree/i)).toBeInTheDocument()
  })

  it('shows empty state when no units exist', async () => {
    render(<OrgUnitTreeManager />)
    await waitFor(() => screen.getByText(/no organizational units yet/i))
  })

  it('shows units when tree loads', async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    mockedApi.getOrgUnitTreeRequest.mockResolvedValue(treeWithRoot as any)
    render(<OrgUnitTreeManager />)
    await waitFor(() => screen.getByText('Engineering'))
  })

  it('shows error state and retry button on load failure', async () => {
    mockedApi.getOrgUnitTreeRequest.mockRejectedValue(new Error('network error'))
    render(<OrgUnitTreeManager />)
    await waitFor(() => screen.getByText(/failed to load/i))
    expect(screen.getByRole('button', { name: /retry/i })).toBeInTheDocument()
  })

  it('creates a new root unit and reloads the tree', async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    mockedApi.createOrgUnitRequest.mockResolvedValue({ data: {} } as any)
    mockedApi.getOrgUnitTreeRequest
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .mockResolvedValueOnce(emptyTree as any)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .mockResolvedValueOnce(treeWithRoot as any)

    render(<OrgUnitTreeManager />)
    await waitFor(() => screen.getByText(/no organizational units yet/i))

    fireEvent.change(screen.getByLabelText(/unit name/i), { target: { value: 'Engineering' } })
    fireEvent.click(screen.getByRole('button', { name: /create/i }))

    await waitFor(() =>
      expect(mockedApi.createOrgUnitRequest).toHaveBeenCalledWith({
        name: 'Engineering',
        parentId: null,
      })
    )
  })
})
