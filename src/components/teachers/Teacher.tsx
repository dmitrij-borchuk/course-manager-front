import React, { useMemo } from 'react'
import { FormattedMessage } from 'react-intl'
import { Button, Container } from 'react-materialize'
import { ROUTES } from '../../constants'
import { useOrgId } from '../../hooks/useOrgId'
import { Activity } from '../../types/activity'
import { Dictionary } from '../../types/dictionary'
import { OrganizationUser } from '../../types/user'
import { AttendanceRateBadge } from '../kit/attendanceRateBadge/AttendancerateBadge'
import { IconButton } from '../kit/buttons/IconButton'
import { CollectionItemLink } from '../kit/collectionItemLink/CollectionItemLink'
import { Ellipsis } from '../kit/ellipsis/Ellipsis'
import { List } from '../kit/list/List'
import { SectionHeader } from '../kit/sectionHeader/SectionHeader'
import { Text } from '../kit/text/Text'
import { AssignGroups } from './AssignGroups'

interface Props {
  className?: string
  data: OrganizationUser
  // onDelete: () => void
  attendanceRates: Dictionary<number>
  teachersGroups?: Activity[]
}
export const Teacher: React.FC<Props> = ({ className = '', data, attendanceRates, teachersGroups = [] }) => {
  const { name } = data

  return (
    <div className={className}>
      <Container className="px-4">
        <div className="flex justify-between">
          <SectionHeader className="min-w-0">
            <Ellipsis>{name}</Ellipsis>
          </SectionHeader>
          <div className="flex items-center space-x-2 pt-4">
            {/* TODO */}
            {/* <Link to={`/${orgId}${ROUTES.TEACHERS_EDIT}/${id}`}>
              <IconButton type="square" size={40} icon="edit" />
            </Link> */}
            {/* TODO */}
            {/* <DeleteIconWithDialog
              header={intl.formatMessage({ id: 'teachers.delete.header' })}
              content={<FormattedMessage id="teachers.delete.text" />}
              onSubmit={onDelete}
            /> */}
          </div>
        </div>

        {/* Description */}
        {/* TODO: should we use description at all, maybe something like `notes` that is private to viewer */}
        {/* <div className="break-words">{description}</div> */}

        {/* Groups */}
        <GroupsInfoBlock teacher={data} teachersGroups={teachersGroups} attendanceRates={attendanceRates} />
      </Container>
    </div>
  )
}

interface GroupsInfoBlockProps {
  teacher: OrganizationUser
  attendanceRates: Dictionary<number>
  teachersGroups?: Activity[]
}
const GroupsInfoBlock = ({ teacher, attendanceRates, teachersGroups = [] }: GroupsInfoBlockProps) => {
  const renderItem = useMemo(() => getGroupItemRender(attendanceRates), [attendanceRates])

  // TODO: loading
  return (
    <>
      <div className="flex justify-between items-center">
        <Text type="h5" color="primary">
          <FormattedMessage id="groups.list.title" />
        </Text>
        {/* Assign groups dialog */}
        {!!teachersGroups?.length && (
          <AssignGroups
            teacher={teacher}
            trigger={<IconButton type="square" size={40} icon="edit" />}
            teachersGroups={teachersGroups}
          />
        )}
      </div>

      {!!teachersGroups?.length ? (
        <List items={teachersGroups} renderItem={renderItem} />
      ) : (
        <NoGroupsInfoBlock teacher={teacher} />
      )}
    </>
  )
}

interface NoGroupsInfoBlockProps {
  teacher: OrganizationUser
}
const NoGroupsInfoBlock = ({ teacher }: NoGroupsInfoBlockProps) => {
  return (
    <div className="text-center">
      <Text type="h6" color="textGray" className="mb-3">
        <FormattedMessage id="teachers.groups.empty" />
      </Text>

      {/* Assign teacher dialog */}
      <AssignGroups
        teacher={teacher}
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
  const orgId = useOrgId()

  return (
    <CollectionItemLink to={`/${orgId}${ROUTES.GROUPS_ROOT}/${group.id}`}>
      <div className="flex justify-between">
        <Ellipsis>{group.name}</Ellipsis>
        {/* TODO: add loading */}
        {attendanceRate !== undefined && <AttendanceRateBadge value={attendanceRate} />}
      </div>
    </CollectionItemLink>
  )
}

function getGroupItemRender(attendances: Dictionary<number>) {
  return (data: Activity) => <GroupWithAttendance key={data.id} group={data} attendanceRate={attendances[data.id]} />
}
