import React, { useEffect, useState } from 'react'
import { getOrgUnitsRequest } from 'api/organizationUnits'
import { OrganizationUnit } from 'types/organizationUnit'

type Props = {
  value: string | null
  includeDescendants: boolean
  onChange: (unitId: string | null, includeDescendants: boolean) => void
  disabled?: boolean
}

/**
 * Read-only unit selector for manager report filters.
 * Renders a flat select list of organizational units with an option
 * to include all descendant units in the report scope.
 */
export function OrgUnitReportSelector({ value, includeDescendants, onChange, disabled }: Props) {
  const [units, setUnits] = useState<OrganizationUnit[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setIsLoading(true)
    getOrgUnitsRequest()
      .then((res) => setUnits(res.data))
      .catch(() => setError('Failed to load organizational units.'))
      .finally(() => setIsLoading(false))
  }, [])

  if (isLoading) return <p aria-live="polite">Loading units...</p>
  if (error) return <p role="alert">{error}</p>
  if (units.length === 0) return null

  const handleUnitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = e.target.value || null
    onChange(selected, includeDescendants)
  }

  const handleDescendantsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(value, e.target.checked)
  }

  return (
    <fieldset>
      <legend>Filter by organizational unit</legend>
      <label htmlFor="org-unit-select">Organizational unit</label>
      <select
        id="org-unit-select"
        value={value ?? ''}
        onChange={handleUnitChange}
        disabled={disabled}
      >
        <option value="">— All units —</option>
        {units.map((u) => (
          <option key={u.id} value={u.id}>
            {u.name}
          </option>
        ))}
      </select>
      {value && (
        <label>
          <input
            type="checkbox"
            checked={includeDescendants}
            onChange={handleDescendantsChange}
            disabled={disabled}
          />
          {' '}Include descendant units
        </label>
      )}
    </fieldset>
  )
}
