import React from 'react'
import { FormattedMessage, useIntl } from 'react-intl'
import { Container } from 'react-materialize'
import { ROUTES } from '../../constants'
import { useOrgId } from '../../hooks/useOrgId'
import { Dictionary } from '../../types/dictionary'
import { Group } from '../../types/group'
import { Student as StudentType } from '../../types/student'
import { HeadingWithControls } from '../kit/headingWithControls/HeadingWithControls'
import { Tag } from '../kit/tag/Tag'
import { GroupsInfoBlock } from './GroupsInfoBlock'

// TODO: add edit
interface Props {
  className?: string
  data: StudentType
  onDelete: () => void
  attendanceRates: Dictionary<number>
  groups?: Group[]
  loadingGroups?: boolean
}
export const Student: React.FC<Props> = ({
  className = '',
  data,
  groups,
  onDelete,
  attendanceRates,
  loadingGroups = false,
}) => {
  const intl = useIntl()
  const orgId = useOrgId()
  const { name, id, tags } = data

  return (
    <div className={className}>
      <Container className="px-4">
        <HeadingWithControls
          text={name}
          // TODO: forbid for non admins
          editPath={`/${orgId}${ROUTES.STUDENTS_EDIT}/${id}`}
          deleteProps={{
            header: intl.formatMessage({ id: 'students.delete.header' }),
            content: <FormattedMessage id="students.delete.text" />,
            onSubmit: onDelete,
          }}
        />

        {tags?.map((t, i) => (
          <Tag
            key={t}
            className="mr-1"
            // TODO: show filtered students by tag
            // onClick={() => {}}
          >
            {t}
          </Tag>
        ))}

        <GroupsInfoBlock
          student={data}
          groups={groups}
          attendanceRates={attendanceRates}
          loadingGroups={loadingGroups}
        />
      </Container>
    </div>
  )
}
