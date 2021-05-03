import React from 'react'
import { FormattedMessage, useIntl } from 'react-intl'
import { Button, Container } from 'react-materialize'
import { Link } from 'react-router-dom'
import { ROUTES } from '../../constants'
import { Group } from '../../types/group'
import { UserInfoFull } from '../../types/userInfo'
import { IconButton } from '../kit/buttons/IconButton'
import { DeleteIconWithDialog } from '../kit/deleteIconWithDialog/DeleteIconWithDialog'
import { Ellipsis } from '../kit/ellipsis/Ellipsis'
import { ListWithLinks } from '../kit/list/List'
import { SectionHeader } from '../kit/sectionHeader/SectionHeader'
import { Text } from '../kit/text/Text'
import { AssignGroups } from './AssignGroups'

interface Props {
  className?: string
  data: UserInfoFull
  onDelete: () => void
}
export const Teacher: React.FC<Props> = ({ className = '', data, onDelete }) => {
  const intl = useIntl()

  const { name, description, id } = data

  return (
    <div className={className}>
      <Container>
        <div className="flex justify-between">
          <SectionHeader className="min-w-0">
            <Ellipsis>{name}</Ellipsis>
          </SectionHeader>
          <div className="flex items-center space-x-2 pt-4">
            <Link to={`${ROUTES.TEACHERS_EDIT}/${id}`}>
              <IconButton type="square" size={40} icon="edit" />
            </Link>
            <DeleteIconWithDialog
              header={intl.formatMessage({ id: 'teachers.delete.header' })}
              content={<FormattedMessage id="teachers.delete.text" />}
              onSubmit={onDelete}
            />
          </div>
        </div>

        {/* Description */}
        <div className="break-words">{description}</div>

        {/* Groups */}
        <GroupsInfoBlock teacher={data} groups={data.groups} />
      </Container>
    </div>
  )
}

interface GroupsInfoBlockProps {
  groups?: Group[]
  teacher: UserInfoFull
}
const GroupsInfoBlock = ({ groups, teacher }: GroupsInfoBlockProps) => {
  return (
    <>
      <div className="flex justify-between items-center">
        <Text type="h5" color="primary">
          <FormattedMessage id="groups.list.title" />
        </Text>
        {/* Assign groups dialog */}
        {groups?.length && (
          <AssignGroups teacher={teacher} trigger={<IconButton type="square" size={40} icon="edit" />} />
        )}
      </div>

      {groups?.length ? (
        <ListWithLinks items={groups} itemLinkRoot={ROUTES.GROUPS_ROOT} labelProp="name" />
      ) : (
        <NoGroupsInfoBlock teacher={teacher} />
      )}
    </>
  )
}

interface NoGroupsInfoBlockProps {
  teacher: UserInfoFull
}
const NoGroupsInfoBlock = ({ teacher }: NoGroupsInfoBlockProps) => {
  return (
    <div className="text-center">
      <Text type="h6" color="textGray" className="mb-3">
        <FormattedMessage id="groups.teacher.empty" />
      </Text>

      {/* Assign teacher dialog */}
      <AssignGroups
        teacher={teacher}
        trigger={
          <Button waves="light">
            <FormattedMessage id="teachers.groups.assignBtn.label" />
          </Button>
        }
      />
    </div>
  )
}
