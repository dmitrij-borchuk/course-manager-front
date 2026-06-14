import React, { useState } from 'react'
import { OrgUnitTreeManager } from 'components/organizations/OrgUnitTreeManager'
import { UnitMembershipPanel } from 'components/organizations/UnitMembershipPanel'

/**
 * Admin page for managing the organizational tree and unit memberships.
 */
export function OrganizationalTreePage() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [selectedUnitId, setSelectedUnitId] = useState<string | null>(null)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [selectedUnitName, setSelectedUnitName] = useState<string>('')

  return (
    <main aria-label="Organizational Tree Admin">
      <h1>Organizational Structure</h1>
      <p>
        Use this page to manage your organization&apos;s departmental, team, or regional structure. Assign students and
        teachers to units for advanced reporting.
      </p>

      <OrgUnitTreeManager />

      {selectedUnitId && <UnitMembershipPanel unitId={selectedUnitId} unitName={selectedUnitName} />}
    </main>
  )
}
