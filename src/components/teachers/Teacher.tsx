import React, { useMemo } from 'react'
import { FormattedMessage, useIntl } from 'react-intl'
import { Button, Container } from 'react-materialize'
import { Link } from 'react-router-dom'
import { ROUTES } from '../../constants'
import { Dictionary } from '../../types/dictionary'
import { Group } from '../../types/group'
import { UserInfoFull } from '../../types/userInfo'
import { AttendanceRateBadge } from '../kit/attendanceRateBadge/AttendancerateBadge'
import { IconButton } from '../kit/buttons/IconButton'
import { CollectionItemLink } from '../kit/collectionItemLink/CollectionItemLink'
import { DeleteIconWithDialog } from '../kit/deleteIconWithDialog/DeleteIconWithDialog'
import { Ellipsis } from '../kit/ellipsis/Ellipsis'
import { List } from '../kit/list/List'
import { SectionHeader } from '../kit/sectionHeader/SectionHeader'
import { Text } from '../kit/text/Text'
import { AssignGroups } from './AssignGroups'

interface Props {
  className?: string
  data: UserInfoFull
  onDelete: () => void
  attendanceRates: Dictionary<number>
}
export const Teacher: React.FC<Props> = ({ className = '', data, onDelete, attendanceRates }) => {
  const intl = useIntl()

  const { name, description, id } = data

  return (
    <div className={className}>
      <Container className="px-4">
        <div className="flex justify-between">
          <SectionHeader className="min-w-0">
            <Ellipsis>{name}</Ellipsis>
          </SectionHeader>
          <div className="flex items-center space-x-2 pt-4">
            <Link to={`${ROUTES.TEACHERS_EDIT}/${id}`}>
              <IconButton type="square" size={40} icon="edit" />
            </Link>
            <DeleteIconWithDialog
              header={intl.formatMessage({ id: 'teachers.delete.header' })}
              content={<FormattedMessage id="teachers.delete.text" />}
              onSubmit={onDelete}
            />
          </div>
        </div>

        {/* Description */}
        <div className="break-words">{description}</div>

        {/* Groups */}
        <GroupsInfoBlock teacher={data} groups={data.groups} attendanceRates={attendanceRates} />
      </Container>
    </div>
  )
}

interface GroupsInfoBlockProps {
  groups?: Group[]
  teacher: UserInfoFull
  attendanceRates: Dictionary<number>
}
const GroupsInfoBlock = ({ groups, teacher, attendanceRates }: GroupsInfoBlockProps) => {
  const renderItem = useMemo(() => getGroupItemRender(attendanceRates), [attendanceRates])

  return (
    <>
      <div className="flex justify-between items-center">
        <Text type="h5" color="primary">
          <FormattedMessage id="groups.list.title" />
        </Text>
        {/* Assign groups dialog */}
        {!!groups?.length && (
          <AssignGroups teacher={teacher} trigger={<IconButton type="square" size={40} icon="edit" />} />
        )}
      </div>

      {groups?.length ? (
        // <ListWithLinks items={groups} itemLinkRoot={ROUTES.GROUPS_ROOT} labelProp="name" />
        <List items={groups} renderItem={renderItem} />
      ) : (
        <NoGroupsInfoBlock teacher={teacher} />
      )}
    </>
  )
}

interface NoGroupsInfoBlockProps {
  teacher: UserInfoFull
}
const NoGroupsInfoBlock = ({ teacher }: NoGroupsInfoBlockProps) => {
  return (
    <div className="text-center">
      <Text type="h6" color="textGray" className="mb-3">
        <FormattedMessage id="groups.teacher.empty" />
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
  group: Group
  attendanceRate?: number
}
const GroupWithAttendance = ({ group, attendanceRate }: GroupWithAttendanceProps) => {
  return (
    <CollectionItemLink to={`${ROUTES.GROUPS_ROOT}/${group.id}`}>
      <div className="flex justify-between">
        <Ellipsis>{group.name}</Ellipsis>
        {/* TODO: add loading */}
        {attendanceRate !== undefined && <AttendanceRateBadge value={attendanceRate} />}
      </div>
    </CollectionItemLink>
  )
}

function getGroupItemRender(attendances: Dictionary<number>) {
  return (data: Group) => <GroupWithAttendance key={data.id} group={data} attendanceRate={attendances[data.id]} />
}
