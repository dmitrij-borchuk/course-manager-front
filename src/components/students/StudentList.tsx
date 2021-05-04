import React from 'react'
import { FormattedMessage } from 'react-intl'
import { ROUTES } from '../../constants'
import { ListPage } from '../kit/ListPage'

// TODO: add attendance
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
    <ListPage
      className={className}
      items={items}
      loading={loading}
      fabBtnLink={ROUTES.STUDENTS_ADD}
      itemLinkRoot={ROUTES.STUDENTS_ROOT}
      listHeader={<FormattedMessage id="students.list.title" />}
      labelProp="name"
    />
  )
}
