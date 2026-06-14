import React, { useState } from 'react'
import { OrganizationUnitTree } from 'types/organizationUnit'

type Props = {
  node: OrganizationUnitTree
  depth?: number
  onRename: (id: string, name: string) => Promise<void>
  onArchive: (id: string) => Promise<void>
  onAddChild: (parentId: string) => void
}

export function OrgUnitTreeNode({ node, depth = 0, onRename, onArchive, onAddChild }: Props) {
  const [isEditing, setIsEditing] = useState(false)
  const [editName, setEditName] = useState(node.name)
  const [isBusy, setIsBusy] = useState(false)

  const handleRename = async () => {
    if (!editName.trim() || editName === node.name) {
      setIsEditing(false)
      return
    }
    setIsBusy(true)
    await onRename(node.id, editName.trim())
    setIsBusy(false)
    setIsEditing(false)
  }

  const handleArchive = async () => {
    if (!window.confirm(`Archive "${node.name}"? Members will be preserved in history.`)) return
    setIsBusy(true)
    await onArchive(node.id)
    setIsBusy(false)
  }

  return (
    <li style={{ marginLeft: depth * 20 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '4px 0' }}>
        {isEditing ? (
          <>
            <input
              aria-label="Unit name"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleRename()}
              disabled={isBusy}
              autoFocus
            />
            <button onClick={handleRename} disabled={isBusy}>
              Save
            </button>
            <button onClick={() => setIsEditing(false)} disabled={isBusy}>
              Cancel
            </button>
          </>
        ) : (
          <>
            <span>{node.name}</span>
            <button
              aria-label={`Rename ${node.name}`}
              onClick={() => setIsEditing(true)}
              disabled={isBusy}
            >
              Rename
            </button>
            <button
              aria-label={`Add child unit under ${node.name}`}
              onClick={() => onAddChild(node.id)}
              disabled={isBusy}
            >
              + Child
            </button>
            <button
              aria-label={`Archive ${node.name}`}
              onClick={handleArchive}
              disabled={isBusy}
            >
              Archive
            </button>
          </>
        )}
      </div>
      {node.children.length > 0 && (
        <ul aria-label={`Children of ${node.name}`}>
          {node.children.map((child) => (
            <OrgUnitTreeNode
              key={child.id}
              node={child}
              depth={depth + 1}
              onRename={onRename}
              onArchive={onArchive}
              onAddChild={onAddChild}
            />
          ))}
        </ul>
      )}
    </li>
  )
}
