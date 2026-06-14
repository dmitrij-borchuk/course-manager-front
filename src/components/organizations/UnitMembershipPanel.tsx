import React, { useState } from 'react'
import { useUnitMemberships } from 'modules/organizations/hooks/useUnitMemberships'
import { OrgUnitMembership } from 'types/organizationUnit'

type Props = {
  unitId: string
  unitName: string
}

function MembershipRow({
  membership,
  onEnd,
}: {
  membership: OrgUnitMembership
  onEnd: (id: string) => Promise<void>
}) {
  const [isBusy, setIsBusy] = useState(false)

  const handleEnd = async () => {
    if (!window.confirm('Remove this member from the unit? The history will be preserved.')) return
    setIsBusy(true)
    await onEnd(membership.id)
    setIsBusy(false)
  }

  return (
    <li>
      <span>
        Participant #{membership.participantId} ({membership.subjectType})
      </span>
      <button aria-label={`Remove participant ${membership.participantId}`} onClick={handleEnd} disabled={isBusy}>
        Remove
      </button>
    </li>
  )
}

export function UnitMembershipPanel({ unitId, unitName }: Props) {
  const { memberships, isLoading, error, addMember, endMember, reload } =
    useUnitMemberships(unitId)
  const [participantIdInput, setParticipantIdInput] = useState('')
  const [addError, setAddError] = useState<string | null>(null)
  const [isBusy, setIsBusy] = useState(false)

  const handleAdd = async () => {
    const id = parseInt(participantIdInput, 10)
    if (!id || isNaN(id)) return
    setIsBusy(true)
    setAddError(null)
    try {
      await addMember(id)
      setParticipantIdInput('')
    } catch (err: any) {
      setAddError(err?.response?.data?.error ?? 'Failed to add member.')
    } finally {
      setIsBusy(false)
    }
  }

  if (isLoading) return <p aria-live="polite">Loading memberships...</p>

  if (error) {
    return (
      <div role="alert">
        <p>{error}</p>
        <button onClick={reload}>Retry</button>
      </div>
    )
  }

  return (
    <section aria-label={`Memberships for ${unitName}`}>
      <h3>Members of {unitName}</h3>
      {memberships.length === 0 ? (
        <p>No active members in this unit.</p>
      ) : (
        <ul>
          {memberships.map((m) => (
            <MembershipRow key={m.id} membership={m} onEnd={endMember} />
          ))}
        </ul>
      )}
      <div aria-label="Add member to unit">
        <label htmlFor={`add-member-${unitId}`}>Participant ID</label>
        <input
          id={`add-member-${unitId}`}
          type="number"
          value={participantIdInput}
          onChange={(e) => setParticipantIdInput(e.target.value)}
          disabled={isBusy}
          min={1}
        />
        <button onClick={handleAdd} disabled={isBusy || !participantIdInput}>
          Add member
        </button>
        {addError && (
          <p role="alert" style={{ color: 'red' }}>
            {addError}
          </p>
        )}
      </div>
    </section>
  )
}
