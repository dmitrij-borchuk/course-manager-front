import React from 'react'
import { FormattedMessage, useIntl } from 'react-intl'
import { Box } from '@mui/material'
import { ROUTES } from '../../constants'
import { useOrgId } from '../../hooks/useOrgId'
import { Student as StudentType } from '../../types/student'
import { HeadingWithControls } from '../kit/headingWithControls/HeadingWithControls'
import { Tag } from '../kit/tag/Tag'
import { GroupsInfoBlock } from './GroupsInfoBlock'
import { ParticipationTimeline } from 'modules/participants/ParticipantTimeline'

// TODO: add edit
interface Props {
  className?: string
  data: StudentType
  onDelete: () => void
}
export const Student: React.FC<Props> = ({ className = '', data, onDelete }) => {
  const intl = useIntl()
  const orgId = useOrgId()
  const { name, id, tags } = data

  return (
    <div className={className}>
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

      <div className="mt-6">
        <GroupsInfoBlock student={data} />
      </div>

      <Box mt={2}>
        <ParticipationTimeline outerId={data.outerId} participantId={data.id} />
      </Box>
    </div>
  )
}
