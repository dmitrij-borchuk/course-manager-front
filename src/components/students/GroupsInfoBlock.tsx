import React, { useMemo } from 'react'
import { FormattedMessage } from 'react-intl'
import { Button } from 'react-materialize'
import { ROUTES } from '../../constants'
import { Dictionary } from '../../types/dictionary'
import { Group } from '../../types/group'
import { StudentFull } from '../../types/student'
import { AttendanceRateBadge } from '../kit/attendanceRateBadge/AttendancerateBadge'
import { IconButton } from '../kit/buttons/IconButton'
import { CollectionItemLink } from '../kit/collectionItemLink/CollectionItemLink'
import { Ellipsis } from '../kit/ellipsis/Ellipsis'
import { List } from '../kit/list/List'
import { Text } from '../kit/text/Text'
import { AssignGroups } from './AssignGroups'

interface Props {
  groups?: Group[]
  student: StudentFull
  attendanceRates: Dictionary<number>
}
export const GroupsInfoBlock = ({ groups, student, attendanceRates }: Props) => {
  const renderItem = useMemo(() => getGroupItemRender(attendanceRates), [attendanceRates])

  return (
    <>
      <div className="flex justify-between items-center">
        <Text type="h5" color="primary">
          <FormattedMessage id="groups.list.title" />
        </Text>
        {/* Assign groups dialog */}
        {!!groups?.length && (
          <AssignGroups student={student} trigger={<IconButton type="square" size={40} icon="edit" />} />
        )}
      </div>

      {groups?.length ? <List items={groups} renderItem={renderItem} /> : <NoGroupsInfoBlock student={student} />}
    </>
  )
}

interface NoGroupsInfoBlockProps {
  student: StudentFull
}
const NoGroupsInfoBlock = ({ student }: NoGroupsInfoBlockProps) => {
  return (
    <div className="text-center">
      <Text type="h6" color="textGray" className="mb-3">
        <FormattedMessage id="students.groups.empty" />
      </Text>

      {/* Assign groups dialog */}
      <AssignGroups
        student={student}
        trigger={
          <Button waves="light">
            <FormattedMessage id="students.groups.assignBtn.label" />
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
        {attendanceRate !== undefined && <AttendanceRateBadge value={attendanceRate} />}
      </div>
    </CollectionItemLink>
  )
}

function getGroupItemRender(attendances: Dictionary<number>) {
  return (data: Group) => <GroupWithAttendance key={data.id} group={data} attendanceRate={attendances[data.id]} />
}
