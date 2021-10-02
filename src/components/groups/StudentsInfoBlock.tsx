import React, { useMemo } from 'react'
import { FormattedMessage } from 'react-intl'
import { Button, Preloader } from 'react-materialize'
import { ROUTES } from '../../constants'
import { useOrgId } from '../../hooks/useOrgId'
import { Dictionary } from '../../types/dictionary'
import { Group } from '../../types/group'
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
  group: Group
  attendanceRates: Dictionary<number>
  loadingGroups?: boolean
}
export const StudentsInfoBlock = ({
  students,
  group,
  attendanceRates,
  loadingGroups = false,
}: StudentsInfoBlockProps) => {
  const renderItem = useMemo(() => getStudentItemRender(attendanceRates), [attendanceRates])

  return (
    <>
      <div className="flex justify-between items-center">
        <Text type="h5" color="primary">
          <FormattedMessage id="students.list.title" />
        </Text>
        {/* Assign groups dialog */}
        {!!students?.length && (
          <AssignStudents
            group={group}
            trigger={<IconButton type="square" size={40} icon="edit" />}
            studentsOfGroup={students}
          />
        )}
      </div>

      {loadingGroups ? (
        <div className="flex justify-center">
          <Preloader color="red" flashing={false} size="medium" />
        </div>
      ) : students?.length ? (
        <List items={students} renderItem={renderItem} />
      ) : (
        <NoStudentsInfoBlock group={group} />
      )}
    </>
  )
}

interface NoStudentsInfoBlockProps {
  group: Group
  students?: Student[]
}
const NoStudentsInfoBlock = ({ group, students }: NoStudentsInfoBlockProps) => {
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
        studentsOfGroup={students}
      />
    </div>
  )
}

interface StudentWithAttendanceProps {
  data: Student
  attendanceRate?: number
}
const StudentWithAttendance = ({ data, attendanceRate }: StudentWithAttendanceProps) => {
  const orgId = useOrgId()

  return (
    <CollectionItemLink to={`/${orgId}${ROUTES.STUDENTS_ROOT}/${data.id}`}>
      <div className="flex justify-between">
        <Ellipsis>{data.name}</Ellipsis>
        {/* TODO: add loading */}
        {attendanceRate !== undefined && <AttendanceRateBadge value={attendanceRate} />}
      </div>
    </CollectionItemLink>
  )
}

function getStudentItemRender(attendances: Dictionary<number>) {
  return (data: Student) => <StudentWithAttendance key={data.id} data={data} attendanceRate={attendances[data.id]} />
}
