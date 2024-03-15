import React, { useCallback, useState } from 'react'
import { FormattedMessage, useIntl } from 'react-intl'
import { Button } from 'react-materialize'
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
import { ActivityExtended } from 'modules/activities/api'
import { ConfirmationDialogBase } from 'components/kit/ConfirmationDialog/ConfirmationDialog'
import { RelativeTime } from 'components/dates/RelativeTime'
import { OrgLink } from 'components/routing/OrgLink'
import { Profile } from 'types/profile'
import { ROUTES } from '../../constants'
import { useOrgId } from '../../hooks/useOrgId'
import { Activity } from '../../types/activity'
import { Dictionary } from '../../types/dictionary'
import { Student } from '../../types/student'
import { IconButton } from '../kit/buttons/IconButton'
import { HeadingWithControls } from '../kit/headingWithControls/HeadingWithControls'
import { Text } from '../kit/text/Text'
import { UserPreview } from '../kit/userInfo/UserInfo'
import { AssignTeacher } from './AssignTeacher'
import { StudentsInfoBlock } from './StudentsInfoBlock'

// TODO: this file needs to be decomposed
interface Props {
  className?: string
  data: ActivityExtended
  performer?: Profile
  onDelete: () => void
  onClose: () => void
  attendanceRates: Dictionary<{
    rate: number
  }>
  studentsOfGroup: Student[]
  loadingGroups?: boolean
  onUpdateTeacher: () => void
}
export const Group: React.FC<Props> = ({
  className = '',
  data,
  studentsOfGroup,
  onDelete,
  onClose,
  attendanceRates,
  loadingGroups,
  performer,
  onUpdateTeacher,
}) => {
  const { archived } = data

  return (
    <div className={className}>
      <div className="flex w-full items-center mt-6">
        <Heading data={data} onDelete={onDelete} onCloseGroup={onClose} />
      </div>

      <div className="mt-6">
        <ArchivedMessage archived={archived} subject={data.archivedBy} date={data.archivedAt} />
      </div>

      {/* Schedule */}
      {/* Disabled due to lack of requirements and low priority */}
      {/* <ScheduleInfoBlock group={data} /> */}

      {/* Teacher */}
      <TeacherInfoBlock teacher={performer} group={data} onUpdateTeacher={onUpdateTeacher} />

      {/* Students */}
      {/* TODO: add loader */}
      <StudentsInfoBlock
        group={data}
        students={studentsOfGroup}
        attendanceRates={attendanceRates}
        loadingGroups={loadingGroups}
      />
    </div>
  )
}

interface TeacherInfoBlockProps {
  teacher?: Profile
  group: Activity
  onUpdateTeacher: () => void
}
const TeacherInfoBlock = ({ teacher, group, onUpdateTeacher }: TeacherInfoBlockProps) => {
  return (
    <>
      <Typography variant="h5">
        <FormattedMessage id="groups.teacher.title" />
      </Typography>
      {/* TODO: loading for the teacher */}
      {teacher?.id ? (
        <div className="flex justify-between">
          <UserPreview data={teacher} />
          {/* Assign teacher dialog */}
          <AssignTeacher
            onDone={onUpdateTeacher}
            group={group}
            trigger={<IconButton type="square" size={40} icon="edit" />}
          />
        </div>
      ) : (
        <NoTeacherInfoBlock group={group} onUpdateTeacher={onUpdateTeacher} />
      )}
    </>
  )
}

interface NoTeacherInfoBlockProps {
  group: Activity
  onUpdateTeacher: () => void
}
const NoTeacherInfoBlock = ({ group, onUpdateTeacher }: NoTeacherInfoBlockProps) => {
  return (
    <div className="text-center">
      <Text type="h6" color="textGray" className="mb-3">
        <FormattedMessage id="groups.teacher.empty" />
      </Text>

      {/* Assign teacher dialog */}
      <AssignTeacher
        onDone={onUpdateTeacher}
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
          {data.archived ? null : <CloseButton onClick={() => setCancelConfirmation(true)} />}
          <DeleteButton onClick={() => setDeleteConfirmation(true)} />
        </div>
      )}
      {!upMd && (
        <ActivityMenu
          onEditClick={onEdit}
          onCloseClick={() => setCancelConfirmation(true)}
          onDeleteClick={() => setDeleteConfirmation(true)}
          hideClose={data.archived}
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
  hideClose?: boolean
}
function ActivityMenu({ onEditClick, onCloseClick, onDeleteClick, hideClose = false }: ActivityMenuProps) {
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
        {hideClose ? null : (
          <MenuItem onClick={onCloseClick}>
            <ListItemIcon>
              <ArchiveIcon />
            </ListItemIcon>
            <ListItemText>
              <FormattedMessage id="groups.closeBtn.label" />
            </ListItemText>
          </MenuItem>
        )}
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

type ArchivedMessageProps = { archived: boolean; subject?: { name: string; id: number }; date?: string }
function ArchivedMessage({ archived, subject, date }: ArchivedMessageProps) {
  if (!archived) return null

  return (
    <Alert severity="warning">
      {subject && date ? (
        <FormattedMessage
          id="groups.closed.message"
          values={{
            name: <OrgLink to={`${ROUTES.TEACHERS_ROOT}/${subject.id}`}>{subject.name}</OrgLink>,
            date: (
              <b>
                <RelativeTime date={new Date(date)} updateInterval={1} />
              </b>
            ),
          }}
        />
      ) : (
        <FormattedMessage id="groups.closed.message.simple" />
      )}
    </Alert>
  )
}
