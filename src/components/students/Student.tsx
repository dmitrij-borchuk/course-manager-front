import React from 'react'
import { FormattedMessage, useIntl } from 'react-intl'
import { Container } from 'react-materialize'
import { ROUTES } from '../../constants'
import { Dictionary } from '../../types/dictionary'
import { StudentFull } from '../../types/student'
import { HeadingWithControls } from '../kit/headingWithControls/HeadingWithControls'
import { GroupsInfoBlock } from './GroupsInfoBlock'

// TODO: add edit
interface Props {
  className?: string
  data: StudentFull
  onDelete: () => void
  attendanceRates: Dictionary<number>
}
export const Student: React.FC<Props> = ({ className = '', data, onDelete, attendanceRates }) => {
  const intl = useIntl()
  const { groups, name, description, id } = data

  return (
    <div className={className}>
      <Container className="px-4">
        <HeadingWithControls
          text={name}
          editPath={`${ROUTES.STUDENTS_EDIT}/${id}`}
          deleteProps={{
            header: intl.formatMessage({ id: 'students.delete.header' }),
            content: <FormattedMessage id="students.delete.text" />,
            onSubmit: onDelete,
          }}
        />
        <div className="break-words">{description}</div>

        <GroupsInfoBlock student={data} groups={groups} attendanceRates={attendanceRates} />
      </Container>
    </div>
  )
}
