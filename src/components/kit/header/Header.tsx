import { FormattedMessage } from 'react-intl'
import { Divider, Icon, Navbar } from 'react-materialize'
import { Link } from 'react-router-dom'
import { ROUTES } from '../../../constants'
import { useOrgIdNotStrict } from '../../../hooks/useOrgId'

// TODO: use logo

export const Header = () => {
  const orgId = useOrgIdNotStrict()
  const orgItems = [
    <Link key="dashboard" to={`/${orgId}`}>
      <FormattedMessage id="header.nav.dashboard" />
    </Link>,
    <Link key="teachers" to={`/${orgId}${ROUTES.TEACHERS_LIST}`}>
      <FormattedMessage id="header.nav.teachers" />
    </Link>,
    // TODO
    // <Link key="users" to={`/${orgId}${ROUTES.USERS_LIST}`}>
    //   <FormattedMessage id="header.nav.users" />
    // </Link>,
    <Link key="groups" to={`/${orgId}${ROUTES.GROUPS_LIST}`}>
      <FormattedMessage id="header.nav.groups" />
    </Link>,
    <Link key="students" to={`/${orgId}${ROUTES.STUDENTS_LIST}`}>
      <FormattedMessage id="header.nav.students" />
    </Link>,
    <Divider key="divider" />,
    <Link key="logout" to={`/${orgId}${ROUTES.LOGOUT}`}>
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
