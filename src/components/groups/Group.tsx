import React from 'react'
import { FormattedMessage, useIntl } from 'react-intl'
import { Collection, Container } from 'react-materialize'
import { ROUTES } from '../../constants'
import { CollectionItemLink } from '../kit/collectionItemLink/CollectionItemLink'
import { HeadingWithControls } from '../kit/headingWithControls/HeadingWithControls'
import { Text } from '../kit/text/Text'

// TODO: fix layout
// TODO: assign group
interface Props {
  className?: string
  data: {
    id: string
    name: string
    description?: string | null
    teacher?: {
      id: string
      name: string
    } | null
    students?:
      | {
          id: string
          name: string
        }[]
      | null
  }
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
        <Text type="h5" color="primary">
          <FormattedMessage id="groups.teacher.title" />
        </Text>
        {teacher ? (
          <Text type="h6">{teacher.name}</Text>
        ) : (
          <Text type="h6" color="textGray" className="text-center">
            <FormattedMessage id="groups.teacher.empty" />
          </Text>
        )}

        {/* Students */}
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
      </Container>
    </div>
  )
}
