import React from 'react'
import { FormattedMessage } from 'react-intl'
import { Collection, CollectionItem, Container } from 'react-materialize'
import { ROUTES } from '../../constants'
import { Header } from '../kit/header/Header'
import { SectionHeader } from '../kit/sectionHeader/SectionHeader'
import { Text } from '../kit/text/Text'

// TODO: fix layout
// TODO: add edit
// TODO: add delete
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
}
export const Group: React.FC<Props> = ({ className = '', data }) => {
  const { teacher, students, name, description } = data

  return (
    <div className={className}>
      <Header />
      <Container>
        <SectionHeader>{name}</SectionHeader>
        {description}

        {/* Teacher */}
        <Text type="h5" color="primary">
          <FormattedMessage id="groups.teacher.title" />
        </Text>
        {teacher ? (
          <Text type="h6">{teacher.name}</Text>
        ) : (
          <Text>
            <FormattedMessage id="groups.students.empty" />
          </Text>
        )}

        {/* Students */}
        <Text type="h5" color="primary">
          <FormattedMessage id="students.list.title" />
        </Text>
        {students ? (
          <Collection>
            {students.map((student) => (
              <CollectionItem key={student.id} href={`${ROUTES.STUDENTS_ROOT}/${student.id}`}>
                {student.name}
              </CollectionItem>
            ))}
          </Collection>
        ) : (
          <Text>
            <FormattedMessage id="groups.students.empty" />
          </Text>
        )}
      </Container>
    </div>
  )
}
