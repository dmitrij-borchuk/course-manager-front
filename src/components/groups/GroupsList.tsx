import React from 'react'
import { FormattedMessage } from 'react-intl'
import { ROUTES } from '../../constants'
import { ListPage } from '../kit/ListPage'

interface Props {
  loading?: boolean
  className?: string
  items?: {
    id: string
    name: string
  }[]
}
export const GroupsList: React.FC<Props> = ({ className = '', loading = false, items = [] }) => {
  return (
    <ListPage
      className={className}
      items={items}
      loading={loading}
      fabBtnLink={ROUTES.GROUPS_ADD}
      itemLinkRoot={ROUTES.GROUPS_ROOT}
      listHeader={<FormattedMessage id="groups.list.title" />}
    />
  )
}
