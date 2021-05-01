import React from 'react'
import { FormattedMessage, useIntl } from 'react-intl'
import { Button, Collection, Container } from 'react-materialize'
import { ROUTES } from '../../constants'
import { GroupFull } from '../../types/group'
import { UserInfo } from '../../types/userInfo'
import { IconButton } from '../kit/buttons/IconButton'
import { CollectionItemLink } from '../kit/collectionItemLink/CollectionItemLink'
import { HeadingWithControls } from '../kit/headingWithControls/HeadingWithControls'
import { Text } from '../kit/text/Text'
import { UserPreview } from '../kit/userInfo/UserInfo'
import { AssignTeacher } from './AssignTeacher'

// TODO: fix layout
interface Props {
  className?: string
  data: GroupFull
  onDelete: () => void
}
export const Group: React.FC<Props> = ({ className = '', data, onDelete }) => {
  const intl = useIntl()
  const { teacher, students, name, description, id } = data

  return (
    <div className={className}>
      <Container>
        <HeadingWithControls
          text={name}
          editPath={`${ROUTES.GROUPS_EDIT}/${id}`}
          deleteProps={{
            header: intl.formatMessage({ id: 'groups.delete.header' }),
            content: <FormattedMessage id="groups.delete.text" />,
            onSubmit: onDelete,
          }}
        />

        {/* Description */}
        <div className="break-words">{description}</div>

        {/* Teacher */}
        <TeacherInfoBlock teacher={teacher} group={data} />

        {/* Students */}
        <div className="mt-7">
          <Text type="h5" color="primary">
            <FormattedMessage id="students.list.title" />
          </Text>
          {students?.length ? (
            <Collection>
              {students.map((student) => (
                <CollectionItemLink key={student.id} to={`${ROUTES.STUDENTS_ROOT}/${student.id}`}>
                  {student.name}
                </CollectionItemLink>
              ))}
            </Collection>
          ) : (
            <Text type="h6" color="textGray" className="text-center">
              <FormattedMessage id="groups.students.empty" />
            </Text>
          )}
        </div>
      </Container>
    </div>
  )
}

interface TeacherInfoBlockProps {
  teacher?: UserInfo
  group: GroupFull
}
const TeacherInfoBlock = ({ teacher, group }: TeacherInfoBlockProps) => {
  return (
    <>
      <Text type="h5" color="primary">
        <FormattedMessage id="groups.teacher.title" />
      </Text>
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
