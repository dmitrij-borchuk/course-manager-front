import { useMemo } from 'react'
import { FormattedMessage } from 'react-intl'
import { Divider, Icon, Navbar } from 'react-materialize'
import { Link } from 'react-router-dom'
import { ROUTES } from '../../../constants'
import { useAccessManager } from '../../../hooks/useAccessManager'
import { useOrgIdNotStrict } from '../../../hooks/useOrgId'

// TODO: use logo

export const Header = () => {
  const orgId = useOrgIdNotStrict()
  const { hasAccess } = useAccessManager()
  const orgItems = useMemo(() => {
    const items: JSX.Element[] = [
      <Link key="dashboard" to={`/${orgId}`}>
        <FormattedMessage id="header.nav.dashboard" />
      </Link>,
    ]

    if (hasAccess('MANAGE_TEACHERS')) {
      items.push(
        <Link key="teachers" to={`/${orgId}${ROUTES.TEACHERS_LIST}`}>
          <FormattedMessage id="header.nav.teachers" />
        </Link>
      )
    }
    if (hasAccess('MANAGE_GROUPS')) {
      items.push(
        <Link key="groups" to={`/${orgId}${ROUTES.GROUPS_LIST}`}>
          <FormattedMessage id="header.nav.groups" />
        </Link>
      )
    }
    if (hasAccess('MANAGE_STUDENTS')) {
      items.push(
        <Link key="students" to={`/${orgId}${ROUTES.STUDENTS_LIST}`}>
          <FormattedMessage id="header.nav.students" />
        </Link>
      )
    }

    return items.concat([
      // TODO
      // <Link key="users" to={`/${orgId}${ROUTES.USERS_LIST}`}>
      // <FormattedMessage id="header.nav.users" />
      // </Link>
      <Divider key="divider" />,
      <Link key="logout" to={`/${orgId}${ROUTES.LOGOUT}`}>
        <FormattedMessage id="header.nav.logout" />
      </Link>,
    ])
  }, [hasAccess, orgId])

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
