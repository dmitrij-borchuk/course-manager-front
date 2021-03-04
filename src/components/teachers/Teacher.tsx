import React from 'react'
import { FormattedMessage } from 'react-intl'
import { Collection, Container } from 'react-materialize'
import { ROUTES } from '../../constants'
import { IconButton } from '../kit/buttons/IconButton'
import { CollectionItemLink } from '../kit/collectionItemLink/CollectionItemLink'
import { Ellipsis } from '../kit/ellipsis/Ellipsis'
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
    groups?:
      | {
          id: string
          name: string
        }[]
      | null
  }
}
export const Teacher: React.FC<Props> = ({ className = '', data }) => {
  const { groups, name, description } = data

  return (
    <div className={className}>
      <Header />
      <Container>
        <div className="flex justify-between">
          <SectionHeader className="min-w-0">
            <Ellipsis>{name}</Ellipsis>
          </SectionHeader>
          <div className="flex items-center space-x-2 pt-4">
            <IconButton type="square" size={40} icon="edit" />
            <IconButton type="square" size={40} icon="delete" className="color-alert" />
          </div>
        </div>
        {description}

        <Text type="h5" color="primary">
          <FormattedMessage id="groups.list.title" />
        </Text>
        {groups ? (
          <Collection>
            {groups.map((group) => (
              <CollectionItemLink key={group.id} to={`${ROUTES.GROUPS_ROOT}/${group.id}`}>
                {group.name}
              </CollectionItemLink>
            ))}
          </Collection>
        ) : (
          <Text>
            <FormattedMessage id="teachers.groups.empty" />
          </Text>
        )}
      </Container>
    </div>
  )
}
