import React, { useCallback, useMemo, useState } from 'react'
import { FormattedMessage, useIntl } from 'react-intl'
import { Button, Container } from 'react-materialize'
import {
  Alert,
  Button as MuiButton,
  ButtonProps,
  IconButton as MuiIconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material'
import ArchiveIcon from '@mui/icons-material/Archive'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import { Edit, MoreHoriz } from '@mui/icons-material'
import { useHistory } from 'react-router-dom'
import { ConfirmationDialogBase } from 'components/kit/ConfirmationDialog/ConfirmationDialog'
import { ROUTES } from '../../constants'
import { useOrgId } from '../../hooks/useOrgId'
import { Activity } from '../../types/activity'
import { Dictionary } from '../../types/dictionary'
import { Student } from '../../types/student'
import { OrganizationUser } from '../../types/user'
import { IconButton } from '../kit/buttons/IconButton'
import { HeadingWithControls } from '../kit/headingWithControls/HeadingWithControls'
import { Text } from '../kit/text/Text'
import { UserPreview } from '../kit/userInfo/UserInfo'
import { AssignTeacher } from './AssignTeacher'
import { StudentsInfoBlock } from './StudentsInfoBlock'

interface Props {
  className?: string
  data: Activity & { teacher: OrganizationUser }
  onDelete: () => void
  onClose: () => void
  attendanceRates: Dictionary<number>
  studentsOfGroup: Student[]
  loadingGroups?: boolean
}
export const Group: React.FC<Props> = ({
  className = '',
  data,
  studentsOfGroup,
  onDelete,
  onClose,
  attendanceRates,
  loadingGroups,
}) => {
  const { teacher, archived } = data
  const simpleGroup = useMemo(
    () => ({
      ...data,
      teacher: data.teacher?.outerId,
    }),
    [data]
  )

  return (
    <div className={className}>
      <Container className="px-4">
        <div className="flex w-full items-center mt-6">
          <Heading data={data} onDelete={onDelete} onCloseGroup={onClose} />
        </div>

        <div className="mt-6">
          <ArchivedMessage archived={archived} />
        </div>

        {/* Schedule */}
        {/* Disabled due to lack of requirements and low priority */}
        {/* <ScheduleInfoBlock group={data} /> */}

        {/* Teacher */}
        <TeacherInfoBlock teacher={teacher} group={data} />

        {/* Students */}
        {/* TODO: add loader */}
        <StudentsInfoBlock
          group={simpleGroup}
          students={studentsOfGroup}
          attendanceRates={attendanceRates}
          loadingGroups={loadingGroups}
        />
      </Container>
    </div>
  )
}

interface TeacherInfoBlockProps {
  teacher?: OrganizationUser
  group: Activity & { teacher: OrganizationUser }
}
const TeacherInfoBlock = ({ teacher, group }: TeacherInfoBlockProps) => {
  return (
    <>
      <Text type="h5" color="primary">
        <FormattedMessage id="groups.teacher.title" />
      </Text>
      {/* TODO: loading for the teacher */}
      {teacher?.id ? (
        <div className="flex justify-between">
          <UserPreview data={teacher} />
          {/* Assign teacher dialog */}
          <AssignTeacher group={group} trigger={<IconButton type="square" size={40} icon="edit" />} />
        </div>
      ) : (
        <NoTeacherInfoBlock group={group} />
      )}
    </>
  )
}

interface NoTeacherInfoBlockProps {
  group: Activity
}
const NoTeacherInfoBlock = ({ group }: NoTeacherInfoBlockProps) => {
  return (
    <div className="text-center">
      <Text type="h6" color="textGray" className="mb-3">
        <FormattedMessage id="groups.teacher.empty" />
      </Text>

      {/* Assign teacher dialog */}
      <AssignTeacher
        group={group}
        trigger={
          <Button waves="light">
            <FormattedMessage id="groups.teacher.assignBtn.label" />
          </Button>
        }
      />
    </div>
  )
}

function CloseButton(props: ButtonProps) {
  return (
    <HeaderButton startIcon={<ArchiveIcon />} {...props}>
      <FormattedMessage id="groups.closeBtn.label" />
    </HeaderButton>
  )
}
function EditButton(props: ButtonProps) {
  return (
    <HeaderButton startIcon={<EditIcon />} {...props}>
      <FormattedMessage id="common.edit" />
    </HeaderButton>
  )
}
function DeleteButton(props: ButtonProps) {
  return (
    <HeaderButton variant="outlined" color="error" startIcon={<DeleteIcon />} {...props}>
      <FormattedMessage id="groups.deleteBtn.label" />
    </HeaderButton>
  )
}
function HeaderButton({ className, ...props }: ButtonProps) {
  return <MuiButton className={`whitespace-nowrap flex-shrink-0 ${className}`} variant="outlined" {...props} />
}

type HeadingProps = {
  data: Activity
  onDelete: () => void
  onCloseGroup: () => void
}
function Heading({ data, onDelete, onCloseGroup }: HeadingProps) {
  const orgId = useOrgId()
  const { name, id } = data
  const theme = useTheme()
  const upMd = useMediaQuery(theme.breakpoints.up('md'))
  const editPath = `/${orgId}${ROUTES.GROUPS_EDIT}/${id}`
  const history = useHistory()
  const onEdit = () => history.push(editPath)
  const [cancelConfirmation, setCancelConfirmation] = useState(false)
  const onCloseGroupConfirmed = useCallback(async () => {
    await onCloseGroup()
    setCancelConfirmation(false)
  }, [onCloseGroup])
  const [deleteConfirmation, setDeleteConfirmation] = useState(false)
  const onDeleteConfirmed = useCallback(async () => {
    await onDelete()
    setCancelConfirmation(false)
  }, [onDelete])

  return (
    <>
      <HeadingWithControls text={name} />
      {upMd && (
        <div className="flex gap-3">
          <EditButton onClick={onEdit} />
          <CloseButton onClick={() => setCancelConfirmation(true)} />
          <DeleteButton onClick={() => setCancelConfirmation(true)} />
        </div>
      )}
      {!upMd && (
        <ActivityMenu
          onEditClick={onEdit}
          onCloseClick={() => setCancelConfirmation(true)}
          onDeleteClick={() => setDeleteConfirmation(true)}
        />
      )}

      {/* Confirm closing group */}
      <ConfirmationDialogBase
        title={<FormattedMessage id="groups.closeConfirmation.header" />}
        onClose={() => setCancelConfirmation(false)}
        onSubmit={onCloseGroupConfirmed}
        open={cancelConfirmation}
        confirmBtnProps={{
          variant: 'contained',
          color: 'error',
        }}
      >
        <FormattedMessage id="groups.closeConfirmation.text" />
      </ConfirmationDialogBase>

      {/* Confirm deleting group */}
      <ConfirmationDialogBase
        title={<FormattedMessage id="groups.delete.header" />}
        onClose={() => setDeleteConfirmation(false)}
        onSubmit={onDeleteConfirmed}
        open={deleteConfirmation}
        confirmBtnProps={{
          variant: 'contained',
          color: 'error',
        }}
      >
        <FormattedMessage id="groups.delete.text" />
      </ConfirmationDialogBase>
    </>
  )
}

type ActivityMenuProps = {
  onEditClick: () => void
  onCloseClick: () => void
  onDeleteClick: () => void
}
function ActivityMenu({ onEditClick, onCloseClick, onDeleteClick }: ActivityMenuProps) {
  const intl = useIntl()
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }

  return (
    <>
      <MuiIconButton
        aria-label={intl.formatMessage({ id: 'groups.moreMenu.title' })}
        onClick={handleClick}
        sx={{
          borderRadius: '12px',
          backgroundColor: 'primary.main',
          color: 'primary.contrastText',
          '&:hover': {
            backgroundColor: 'primary.light',
          },
        }}
      >
        <MoreHoriz />
      </MuiIconButton>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
        onClick={handleClose}
      >
        {/* Edit */}
        <MenuItem onClick={onEditClick}>
          <ListItemIcon>
            <Edit fontSize="small" />
          </ListItemIcon>
          <ListItemText>
            <FormattedMessage id="common.edit" />
          </ListItemText>
        </MenuItem>
        {/* Close */}
        <MenuItem onClick={onCloseClick}>
          <ListItemIcon>
            <ArchiveIcon />
          </ListItemIcon>
          <ListItemText>
            <FormattedMessage id="groups.closeBtn.label" />
          </ListItemText>
        </MenuItem>
        {/* Delete */}
        <MenuItem onClick={onDeleteClick}>
          <ListItemIcon>
            <ArchiveIcon color="error" />
          </ListItemIcon>
          <ListItemText>
            <Typography color="error">
              <FormattedMessage id="groups.deleteBtn.label" />
            </Typography>
          </ListItemText>
        </MenuItem>
      </Menu>
    </>
  )
}

function ArchivedMessage({ archived }: { archived: boolean }) {
  if (!archived) return null

  return (
    <Alert severity="warning">
      <FormattedMessage id="groups.closed.message" />
    </Alert>
  )
}
