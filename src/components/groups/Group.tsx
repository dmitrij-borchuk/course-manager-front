import React, { useMemo } from 'react'
import { FormattedMessage, useIntl } from 'react-intl'
import { Button, Container } from 'react-materialize'
import { ROUTES } from '../../constants'
import { useOrgId } from '../../hooks/useOrgId'
import { Dictionary } from '../../types/dictionary'
import { GroupFull } from '../../types/group'
import { Student } from '../../types/student'
import { OrganizationUser } from '../../types/user'
import { IconButton } from '../kit/buttons/IconButton'
import { HeadingWithControls } from '../kit/headingWithControls/HeadingWithControls'
import { Text } from '../kit/text/Text'
import { UserPreview } from '../kit/userInfo/UserInfo'
import { AssignTeacher } from './AssignTeacher'
import { ScheduleInfoBlock } from './ScheduleInfoBlock'
import { StudentsInfoBlock } from './StudentsInfoBlock'

interface Props {
  className?: string
  data: GroupFull
  onDelete: () => void
  attendanceRates: Dictionary<number>
  studentsOfGroup: Student[]
}
export const Group: React.FC<Props> = ({ className = '', data, studentsOfGroup, onDelete, attendanceRates }) => {
  const orgId = useOrgId()
  const intl = useIntl()
  const { teacher, name, description, id } = data
  const simpleGroup = useMemo(
    () => ({
      ...data,
      teacher: data.teacher?.id,
    }),
    [data]
  )

  return (
    <div className={className}>
      <Container className="px-4">
        <HeadingWithControls
          text={name}
          editPath={`/${orgId}${ROUTES.GROUPS_EDIT}/${id}`}
          deleteProps={{
            header: intl.formatMessage({ id: 'groups.delete.header' }),
            content: <FormattedMessage id="groups.delete.text" />,
            onSubmit: onDelete,
          }}
        />

        {/* Description */}
        <div className="break-words">{description}</div>

        {/* Schedule */}
        <ScheduleInfoBlock group={data} />

        {/* Teacher */}
        <TeacherInfoBlock teacher={teacher} group={data} />

        {/* Students */}
        {/* TODO: add loader */}
        <StudentsInfoBlock group={simpleGroup} students={studentsOfGroup} attendanceRates={attendanceRates} />
      </Container>
    </div>
  )
}

interface TeacherInfoBlockProps {
  teacher?: OrganizationUser
  group: GroupFull
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
  group: GroupFull
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
