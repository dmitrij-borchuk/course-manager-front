import React from 'react'
import { FormattedMessage } from 'react-intl'
import { Collection, Container } from 'react-materialize'
import { Link } from 'react-router-dom'
import { ROUTES } from '../../constants'
import { CollectionItemLink } from '../kit/collectionItemLink/CollectionItemLink'
import { FabBtn } from '../kit/FabBtn/FabBtn'
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
            <CollectionItemLink key={item.id} to={`${ROUTES.TEACHERS_ROOT}/${item.id}`}>
              {item.name}
            </CollectionItemLink>
          ))}
        </Collection>
      </Container>

      <Link to={ROUTES.TEACHERS_ADD}>
        <FabBtn />
      </Link>
    </div>
  )
}
