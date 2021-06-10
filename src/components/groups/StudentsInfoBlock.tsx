import React, { useMemo } from 'react'
import { FormattedMessage } from 'react-intl'
import { Button } from 'react-materialize'
import { ROUTES } from '../../constants'
import { Dictionary } from '../../types/dictionary'
import { GroupFull } from '../../types/group'
import { Student } from '../../types/student'
import { AttendanceRateBadge } from '../kit/attendanceRateBadge/AttendancerateBadge'
import { IconButton } from '../kit/buttons/IconButton'
import { CollectionItemLink } from '../kit/collectionItemLink/CollectionItemLink'
import { Ellipsis } from '../kit/ellipsis/Ellipsis'
import { List } from '../kit/list/List'
import { Text } from '../kit/text/Text'
import { AssignStudents } from './AssignStudents'

interface StudentsInfoBlockProps {
  students?: Student[]
  group: GroupFull
  attendanceRates: Dictionary<number>
}
export const StudentsInfoBlock = ({ students, group, attendanceRates }: StudentsInfoBlockProps) => {
  const renderItem = useMemo(() => getStudentItemRender(attendanceRates), [attendanceRates])

  return (
    <>
      <div className="flex justify-between items-center">
        <Text type="h5" color="primary">
          <FormattedMessage id="students.list.title" />
        </Text>
        {/* Assign groups dialog */}
        {!!students?.length && (
          <AssignStudents group={group} trigger={<IconButton type="square" size={40} icon="edit" />} />
        )}
      </div>
      {/* TODO: loading for the students */}

      {students?.length ? <List items={students} renderItem={renderItem} /> : <NoStudentsInfoBlock group={group} />}
    </>
  )
}

interface NoStudentsInfoBlockProps {
  group: GroupFull
}
const NoStudentsInfoBlock = ({ group }: NoStudentsInfoBlockProps) => {
  return (
    <div className="text-center">
      <Text type="h6" color="textGray" className="mb-3">
        <FormattedMessage id="groups.students.empty" />
      </Text>

      {/* Assign students dialog */}
      <AssignStudents
        group={group}
        trigger={
          <Button waves="light">
            <FormattedMessage id="groups.students.assignBtn.label" />
          </Button>
        }
      />
    </div>
  )
}

interface StudentWithAttendanceProps {
  data: Student
  attendanceRate?: number
}
const StudentWithAttendance = ({ data, attendanceRate }: StudentWithAttendanceProps) => {
  return (
    <CollectionItemLink to={`${ROUTES.STUDENTS_ROOT}/${data.id}`}>
      <div className="flex justify-between">
        <Ellipsis>{data.name}</Ellipsis>
        {attendanceRate !== undefined && <AttendanceRateBadge value={attendanceRate} />}
      </div>
    </CollectionItemLink>
  )
}

function getStudentItemRender(attendances: Dictionary<number>) {
  return (data: Student) => <StudentWithAttendance key={data.id} data={data} attendanceRate={attendances[data.id]} />
}
