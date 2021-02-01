import React from 'react'
import { FormattedMessage } from 'react-intl'
import { Collection, CollectionItem, Container } from 'react-materialize'
import { ROUTES } from '../../constants'
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
export const TeachersList: React.FC<Props> = ({ className = '', loading = false, items = [] }) => {
  return (
    <div className={className}>
      <Header />
      <Container>
        <SectionHeader>
          <FormattedMessage id="teachers.list.title" />
        </SectionHeader>

        <Collection>
          {items.map((item) => (
            <CollectionItem key={item.id} href={`${ROUTES.TEACHERS_ROOT}/${item.id}`}>
              {item.name}
            </CollectionItem>
          ))}
        </Collection>
      </Container>
    </div>
  )
}
