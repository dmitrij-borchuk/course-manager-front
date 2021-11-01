import React, { ComponentProps } from 'react'
import { Link } from 'react-router-dom'
import { IconButton } from '../buttons/IconButton'
import { DeleteIconWithDialog } from '../deleteIconWithDialog/DeleteIconWithDialog'
import { Ellipsis } from '../ellipsis/Ellipsis'
import { SectionHeader } from '../sectionHeader/SectionHeader'

interface Props {
  text: string
  editPath?: string
  deleteProps?: ComponentProps<typeof DeleteIconWithDialog>
}
export const HeadingWithControls = ({ text, editPath, deleteProps }: Props) => {
  return (
    <div className="flex justify-between">
      <SectionHeader className="min-w-0">
        <Ellipsis>{text}</Ellipsis>
      </SectionHeader>
      <div className="flex items-center space-x-2 pt-4">
        {editPath && (
          <Link to={editPath} data-testid="edit-btn">
            <IconButton type="square" size={40} icon="edit" />
          </Link>
        )}
        {deleteProps && <DeleteIconWithDialog triggerProps={{ 'data-testid': 'delete-btn' }} {...deleteProps} />}
      </div>
    </div>
  )
}
