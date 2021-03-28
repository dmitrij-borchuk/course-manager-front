import React from 'react'
import { FormattedMessage } from 'react-intl'
import { Collection, Container } from 'react-materialize'
import { Link } from 'react-router-dom'
import { ROUTES } from '../../constants'
import { Group } from '../../types/group'
import { User } from '../../types/user'
import { IconButton } from '../kit/buttons/IconButton'
import { CollectionItemLink } from '../kit/collectionItemLink/CollectionItemLink'
import { Ellipsis } from '../kit/ellipsis/Ellipsis'
import { Header } from '../kit/header/Header'
import { Message } from '../kit/message/Message'
import { SectionHeader } from '../kit/sectionHeader/SectionHeader'
import { Text } from '../kit/text/Text'

// TODO: fix layout
// TODO: add edit
// TODO: add delete
// TODO: assign group
interface Props {
  className?: string
  data: User
  groups: Group[]
}
export const Teacher: React.FC<Props> = ({ className = '', data, groups = [] }) => {
  const { user_info, id } = data

  if (!user_info) {
    return <Message>TBD: Can't find `userInfo`</Message>
  }

  const { name, description } = user_info

  return (
    <div className={className}>
      <Header />
      <Container>
        <div className="flex justify-between">
          <SectionHeader className="min-w-0">
            <Ellipsis>{name}</Ellipsis>
          </SectionHeader>
          <div className="flex items-center space-x-2 pt-4">
            <Link to={`${ROUTES.TEACHERS_EDIT}/${id}`}>
              <IconButton type="square" size={40} icon="edit" />
            </Link>
            <IconButton type="square" size={40} icon="delete" className="color-alert" />
          </div>
        </div>
        {/* TODO: break all */}
        {description}

        <Text type="h5" color="primary">
          <FormattedMessage id="groups.list.title" />
        </Text>
        {groups.length ? (
          <Collection>
            {groups.map((group) => (
              <CollectionItemLink key={group.id} to={`${ROUTES.GROUPS_ROOT}/${group.id}`}>
                {group.name}
              </CollectionItemLink>
            ))}
          </Collection>
        ) : (
          <div className="flex justify-center">
            <Text type="h6" color="textGray">
              <FormattedMessage id="teachers.groups.empty" />
            </Text>
          </div>
        )}
      </Container>
    </div>
  )
}
