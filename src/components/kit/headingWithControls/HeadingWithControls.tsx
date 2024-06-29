import React, { ComponentProps, ReactNode } from 'react'
import { Link } from 'react-router-dom'
import EditIcon from '@mui/icons-material/Edit'
import { DeleteIconWithDialog } from '../deleteIconWithDialog/DeleteIconWithDialog'
import { Ellipsis } from '../ellipsis/Ellipsis'
import { SectionHeader } from '../sectionHeader/SectionHeader'
import IconButton from '@mui/material/IconButton'

interface Props {
  text: ReactNode
  editPath?: string
  deleteProps?: ComponentProps<typeof DeleteIconWithDialog>
}
export const HeadingWithControls = ({ text, editPath, deleteProps }: Props) => {
  return (
    <div className="flex justify-between w-full min-w-0">
      <SectionHeader className="min-w-0">
        <Ellipsis>{text}</Ellipsis>
      </SectionHeader>
      <div className="flex items-center space-x-2">
        {editPath && (
          <IconButton component={Link} to={editPath} data-testid="edit-btn">
            <EditIcon />
          </IconButton>
        )}
        {deleteProps && <DeleteIconWithDialog {...deleteProps} />}
      </div>
    </div>
  )
}
