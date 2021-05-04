import React from 'react'
import { FormattedMessage } from 'react-intl'
import { Button } from 'react-materialize'
import { ROUTES } from '../../constants'
import { Group } from '../../types/group'
import { StudentFull } from '../../types/student'
import { IconButton } from '../kit/buttons/IconButton'
import { ListWithLinks } from '../kit/list/List'
import { Text } from '../kit/text/Text'
import { AssignGroups } from './AssignGroups'

interface Props {
  groups?: Group[]
  student: StudentFull
}
export const GroupsInfoBlock = ({ groups, student }: Props) => {
  return (
    <>
      <div className="flex justify-between items-center">
        <Text type="h5" color="primary">
          <FormattedMessage id="groups.list.title" />
        </Text>
        {/* Assign groups dialog */}
        {!!groups?.length && (
          <AssignGroups student={student} trigger={<IconButton type="square" size={40} icon="edit" />} />
        )}
      </div>

      {groups?.length ? (
        <ListWithLinks items={groups} itemLinkRoot={ROUTES.GROUPS_ROOT} labelProp="name" />
      ) : (
        <NoGroupsInfoBlock student={student} />
      )}
    </>
  )
}

interface NoGroupsInfoBlockProps {
  student: StudentFull
}
const NoGroupsInfoBlock = ({ student }: NoGroupsInfoBlockProps) => {
  return (
    <div className="text-center">
      <Text type="h6" color="textGray" className="mb-3">
        <FormattedMessage id="students.groups.empty" />
      </Text>

      {/* Assign groups dialog */}
      <AssignGroups
        student={student}
        trigger={
          <Button waves="light">
            <FormattedMessage id="students.groups.assignBtn.label" />
          </Button>
        }
      />
    </div>
  )
}
