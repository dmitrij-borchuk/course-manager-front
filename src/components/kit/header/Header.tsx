import { FormattedMessage } from 'react-intl'
import { Divider, Icon, Navbar } from 'react-materialize'
import { Link } from 'react-router-dom'
import { ROUTES } from '../../../constants'
import { useOrgId } from '../../../hooks/useOrgId'

// TODO: use logo

export const Header = () => {
  const orgId = useOrgId()
  const orgItems = [
    <Link to={`/${orgId}`}>
      <FormattedMessage id="header.nav.dashboard" />
    </Link>,
    <Link to={`/${orgId}${ROUTES.TEACHERS_LIST}`}>
      <FormattedMessage id="header.nav.teachers" />
    </Link>,
    <Link to={`/${orgId}${ROUTES.GROUPS_LIST}`}>
      <FormattedMessage id="header.nav.groups" />
    </Link>,
    <Link to={`/${orgId}${ROUTES.STUDENTS_LIST}`}>
      <FormattedMessage id="header.nav.students" />
    </Link>,
    <Divider />,
    <Link to={`/${orgId}${ROUTES.LOGOUT}`}>
      <FormattedMessage id="header.nav.logout" />
    </Link>,
  ]

  return (
    <Navbar
      alignLinks="right"
      brand={<Link to="/">Learnify</Link>}
      id="mobile-nav"
      menuIcon={<Icon>menu</Icon>}
      centerChildren
      options={{
        draggable: true,
        edge: 'left',
        inDuration: 250,
        outDuration: 200,
        preventScrolling: true,
      }}
    >
      {orgId && orgItems}
      {!orgId && (
        <Link to={ROUTES.LOGOUT}>
          <FormattedMessage id="header.nav.logout" />
        </Link>
      )}
    </Navbar>
  )
}
