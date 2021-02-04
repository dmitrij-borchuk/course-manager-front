import React from 'react'
import { FormattedMessage } from 'react-intl'
import { Collection, Container } from 'react-materialize'
import { ROUTES } from '../../constants'
import { CollectionItemLink } from '../kit/collectionItemLink/CollectionItemLink'
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
        <SectionHeader>{name}</SectionHeader>
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
