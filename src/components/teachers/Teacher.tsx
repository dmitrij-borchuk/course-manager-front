import React, { useMemo } from 'react'
import { FormattedMessage } from 'react-intl'
import { Button } from 'react-materialize'
import { Box, Typography } from '@mui/material'
import FilterAltIcon from '@mui/icons-material/FilterAlt'
import { useActivitiesFiltering } from 'modules/activities/activitiesFilteringContext'
import { ResponsiveButtons } from 'components/kit/responsiveButtons/ResponsiveButtons'
import { TitleWithEdit } from 'components/kit/titleWithEdit/TitleWithEdit'
import { Profile } from 'types/profile'
import { useCurrentUser } from 'hooks/useCurrentUser'
import { useAccessManager } from 'hooks/useAccessManager'
import { ROUTES } from '../../constants'
import { Activity } from '../../types/activity'
import { Dictionary } from '../../types/dictionary'
import { AttendanceRateBadge } from '../kit/attendanceRateBadge/AttendancerateBadge'
import { IconButton } from '../kit/buttons/IconButton'
import { CollectionItemLink } from '../kit/collectionItemLink/CollectionItemLink'
import { Ellipsis } from '../kit/ellipsis/Ellipsis'
import { List } from '../kit/list/List'
import { Text } from '../kit/text/Text'
import { AssignGroups } from './AssignGroups'

interface Props {
  className?: string
  data: Profile
  // onDelete: () => void
  attendanceRates: Dictionary<number>
  teachersGroups?: Activity[]
  onEdit?: (name: string) => void
}
export const Teacher: React.FC<Props> = ({ className = '', data, attendanceRates, teachersGroups = [], onEdit }) => {
  const { name } = data
  const { hasAccess } = useAccessManager()
  const { organizationUser } = useCurrentUser()
  const canEditName = hasAccess('MANAGE_TEACHERS') || organizationUser?.id === data.user.id

  return (
    <div className={className}>
      <div className="flex justify-between">
        <TitleWithEdit
          placeholder={<FormattedMessage id="profile.user.noName" />}
          value={name}
          onSubmit={onEdit}
          canEdit={canEditName}
        />
        <div className="flex items-center space-x-2 pt-4">
          {/* TODO */}
          {/* <DeleteIconWithDialog
              header={intl.formatMessage({ id: 'teachers.delete.header' })}
              content={<FormattedMessage id="teachers.delete.text" />}
              onSubmit={onDelete}
            /> */}
        </div>
      </div>

      {/* Groups */}
      <GroupsInfoBlock teacherId={data.user.id} teachersGroups={teachersGroups} attendanceRates={attendanceRates} />
    </div>
  )
}

interface GroupsInfoBlockProps {
  teacherId: number
  attendanceRates: Dictionary<number>
  teachersGroups?: Activity[]
}
const GroupsInfoBlock = ({ teacherId, attendanceRates, teachersGroups = [] }: GroupsInfoBlockProps) => {
  const renderItem = useMemo(() => getGroupItemRender(attendanceRates), [attendanceRates])
  const { setOpenFilterDialog } = useActivitiesFiltering()

  // TODO: loading
  return (
    <>
      <div className="flex justify-between items-center">
        <Typography variant="h5">
          <FormattedMessage id="groups.list.title" />
        </Typography>

        <Box display="flex">
          <ResponsiveButtons
            items={[
              {
                id: 'filter',
                label: <FormattedMessage id="common.filter" />,
                icon: <FilterAltIcon />,
                onClick: () => setOpenFilterDialog(true),
              },
            ]}
          />

          {/* Assign groups dialog */}
          {!!teachersGroups?.length && (
            <AssignGroups
              teacherId={teacherId}
              trigger={<IconButton type="square" size={40} icon="edit" />}
              teachersGroups={teachersGroups}
            />
          )}
        </Box>
      </div>

      {!!teachersGroups?.length ? (
        <List items={teachersGroups} renderItem={renderItem} />
      ) : (
        <NoGroupsInfoBlock teacherId={teacherId} />
      )}
    </>
  )
}

interface NoGroupsInfoBlockProps {
  teacherId: number
}
const NoGroupsInfoBlock = ({ teacherId }: NoGroupsInfoBlockProps) => {
  return (
    <div className="text-center">
      <Text type="h6" color="textGray" className="mb-3">
        <FormattedMessage id="teachers.groups.empty" />
      </Text>

      {/* Assign teacher dialog */}
      <AssignGroups
        teacherId={teacherId}
        trigger={
          <Button waves="light">
            <FormattedMessage id="teachers.groups.assignBtn.label" />
          </Button>
        }
      />
    </div>
  )
}

interface GroupWithAttendanceProps {
  group: Activity
  attendanceRate?: number
}
const GroupWithAttendance = ({ group, attendanceRate }: GroupWithAttendanceProps) => {
  return (
    <CollectionItemLink to={`${ROUTES.GROUPS_ROOT}/${group.id}`}>
      <div
        className={`flex justify-between transition-opacity ${group.archived ? 'opacity-40 hover:opacity-100' : ''}`}
      >
        <Ellipsis>
          {group.archived ? <FormattedMessage id="groups.archived.name" values={{ name: group.name }} /> : group.name}
        </Ellipsis>
        {/* TODO: add loading */}
        {attendanceRate !== undefined && <AttendanceRateBadge value={attendanceRate} />}
      </div>
    </CollectionItemLink>
  )
}

function getGroupItemRender(attendances: Dictionary<number>) {
  return (data: Activity) => <GroupWithAttendance key={data.id} group={data} attendanceRate={attendances[data.id]} />
}
