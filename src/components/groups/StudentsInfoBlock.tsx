import { FormattedMessage } from 'react-intl'
import { Button } from 'react-materialize'
import { ROUTES } from '../../constants'
import { GroupFull } from '../../types/group'
import { Student } from '../../types/student'
import { IconButton } from '../kit/buttons/IconButton'
import { ListWithLinks } from '../kit/list/List'
import { Text } from '../kit/text/Text'
import { AssignStudents } from './AssignStudents'

interface StudentsInfoBlockProps {
  students?: Student[]
  group: GroupFull
}
export const StudentsInfoBlock = ({ students, group }: StudentsInfoBlockProps) => {
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

      {students?.length ? (
        <ListWithLinks items={students} itemLinkRoot={ROUTES.STUDENTS_ROOT} labelProp="name" />
      ) : (
        <NoStudentsInfoBlock group={group} />
      )}
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
