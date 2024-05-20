import { useCallback } from 'react'
import { FormattedMessage } from 'react-intl'
import { Container } from 'react-materialize'
import { Link } from 'react-router-dom'
import { CircularProgress, Typography } from '@mui/material'
import { noop } from 'utils/common'
import { ROUTES } from '../../constants'
import { Organization } from '../../types/organization'
import { User } from '../../types/user'
import { Ellipsis } from '../kit/ellipsis/Ellipsis'
import { FabBtn } from '../kit/FabBtn/FabBtn'
import { Header } from '../kit/header/Header'
import { List } from '../kit/list/List'
import { Loader } from '../kit/loader/Loader'
import { Text } from '../kit/text/Text'

// TODO: add loading

interface Props {
  className?: string
  organizations?: Organization[]
  user?: User
  organizationsLoading?: boolean
  onOrgSelected?: (o: Organization) => void
}
export const Organizations = (props: Props) => {
  const { className, organizations = [], user, organizationsLoading = false, onOrgSelected = noop } = props

  if (!user) {
    return <Loader />
  }
  return (
    <div className={className}>
      <Header />
      <Container className="px-4 pb-6">
        <Typography variant="h5">
          <FormattedMessage id="organizations.header.line1" />
        </Typography>
        <Text type="h6" color="textGray" className="mt-2 truncate">
          <FormattedMessage id="organizations.header.line2" />
        </Text>
        <OrganizationList items={organizations} loading={organizationsLoading} onClick={onOrgSelected} />

        {/* TODO: move to top */}
        <Link to={ROUTES.ORGANIZATIONS_ADD}>
          <FabBtn />
        </Link>
      </Container>
    </div>
  )
}

type OrganizationListProps = {
  loading: boolean
  items: Organization[]
  onClick?: (o: Organization) => void
}
const OrganizationList = (props: OrganizationListProps) => {
  const { items, loading, onClick } = props
  const renderItem = useCallback(
    (o: Organization) => {
      return (
        <div
          key={o.id}
          className="collection-item flex justify-between cursor-pointer hover:bg-gray-100"
          onClick={() => onClick?.(o)}
        >
          <Ellipsis>{o.name}</Ellipsis>
          <Text type="body" color="textGray" className="m-0">
            {o.role}
          </Text>
        </div>
      )
    },
    [onClick]
  )

  if (loading) {
    return (
      <div className="flex justify-center">
        <CircularProgress />
      </div>
    )
  }

  return <List items={items} loading={loading} renderItem={renderItem} />
}
