import React, { useState } from 'react'
import { useOrgUnitTree } from 'modules/organizations/hooks/useOrgUnitTree'
import { OrgUnitTreeNode } from 'components/organizations/OrgUnitTreeNode'

export function OrgUnitTreeManager() {
  const { tree, isLoading, error, createUnit, renameUnit, archiveUnit, reload } =
    useOrgUnitTree()
  const [newUnitName, setNewUnitName] = useState('')
  const [addingUnderParent, setAddingUnderParent] = useState<string | null | 'root'>('root')
  const [createError, setCreateError] = useState<string | null>(null)
  const [isBusy, setIsBusy] = useState(false)

  const handleCreate = async () => {
    const trimmed = newUnitName.trim()
    if (!trimmed) return
    setIsBusy(true)
    setCreateError(null)
    try {
      await createUnit(trimmed, addingUnderParent === 'root' ? null : addingUnderParent)
      setNewUnitName('')
      setAddingUnderParent('root')
    } catch {
      setCreateError('Failed to create unit. Please try again.')
    } finally {
      setIsBusy(false)
    }
  }

  if (isLoading) {
    return <p aria-live="polite">Loading organizational tree...</p>
  }

  if (error) {
    return (
      <div role="alert">
        <p>{error}</p>
        <button onClick={reload}>Retry</button>
      </div>
    )
  }

  return (
    <section aria-label="Organizational Tree Management">
      <h2>Organizational Tree</h2>

      {tree.length === 0 ? (
        <p>No organizational units yet. Create your first unit below.</p>
      ) : (
        <ul aria-label="Organizational units">
          {tree.map((node) => (
            <OrgUnitTreeNode
              key={node.id}
              node={node}
              onRename={renameUnit}
              onArchive={archiveUnit}
              onAddChild={(parentId) => setAddingUnderParent(parentId)}
            />
          ))}
        </ul>
      )}

      <div aria-label="Create new organizational unit" style={{ marginTop: 16 }}>
        <h3>{addingUnderParent === 'root' ? 'Add root unit' : 'Add child unit'}</h3>
        <label htmlFor="new-unit-name">Unit name</label>
        <input
          id="new-unit-name"
          value={newUnitName}
          onChange={(e) => setNewUnitName(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
          disabled={isBusy}
          placeholder="e.g. Engineering Department"
        />
        <button onClick={handleCreate} disabled={isBusy || !newUnitName.trim()}>
          Create
        </button>
        {addingUnderParent !== 'root' && (
          <button onClick={() => setAddingUnderParent('root')} disabled={isBusy}>
            Cancel (add to root)
          </button>
        )}
        {createError && (
          <p role="alert" style={{ color: 'red' }}>
            {createError}
          </p>
        )}
      </div>
    </section>
  )
}
