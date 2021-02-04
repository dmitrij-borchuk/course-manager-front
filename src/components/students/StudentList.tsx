import React from 'react'
import { FormattedMessage } from 'react-intl'
import { Collection, Container } from 'react-materialize'
import { ROUTES } from '../../constants'
import { CollectionItemLink } from '../kit/collectionItemLink/CollectionItemLink'
import { Header } from '../kit/header/Header'
import { SectionHeader } from '../kit/sectionHeader/SectionHeader'

// TODO: fix layout
// TODO: add attendance
// TODO: add loading skeleton
// TODO: add empty list placeholder
interface Props {
  loading?: boolean
  className?: string
  items?: {
    id: string
    name: string
  }[]
}
export const StudentList: React.FC<Props> = ({ className = '', loading = false, items = [] }) => {
  return (
    <div className={className}>
      <Header />
      <Container>
        <SectionHeader>
          <FormattedMessage id="students.list.title" />
        </SectionHeader>

        <Collection>
          {items.map((item) => (
            <CollectionItemLink key={item.id} to={`${ROUTES.STUDENTS_ROOT}/${item.id}`}>
              {item.name}
            </CollectionItemLink>
          ))}
        </Collection>
      </Container>
    </div>
  )
}
