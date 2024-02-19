import React, { useMemo } from 'react'
import { Divider, Icon, Navbar } from 'react-materialize'
import { FormattedMessage } from 'react-intl'
import { useQuery } from 'react-query'
import { Link } from 'react-router-dom'
import { Avatar, IconButton, ListItemIcon, ListItemText, Menu, MenuItem, Typography, styled } from '@mui/material'
import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import LogoutIcon from '@mui/icons-material/Logout'
import { getMyProfileRequest } from 'modules/profiles/api'
import { ROUTES } from '../../../constants'
import { useAccessManager } from '../../../hooks/useAccessManager'
import { useOrgIdNotStrict } from '../../../hooks/useOrgId'
import { useAuthStore } from '../../../store/authStore'

// TODO: use logo

export const Header = () => {
  const { currentUser } = useAuthStore()
  const orgId = useOrgIdNotStrict()
  const { hasAccess } = useAccessManager()
  const orgItems = useMemo(() => {
    const items: JSX.Element[] = []

    if (currentUser) {
      items.push(
        <Link key="dashboard" to={`/${orgId}`}>
          <FormattedMessage id="header.nav.dashboard" />
        </Link>
      )
    }

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
    if (hasAccess('VIEW_REPORTS')) {
      items.push(
        <Link key="reports" to={`/${orgId}${ROUTES.REPORTS_ROOT}`}>
          <FormattedMessage id="header.nav.reports" />
        </Link>
      )
    }

    return items.concat([
      // TODO
      // <Link key="users" to={`/${orgId}${ROUTES.USERS_LIST}`}>
      // <FormattedMessage id="header.nav.users" />
      // </Link>
      <Divider key="divider" />,

      currentUser ? (
        <ProfileButton key="profile" />
      ) : (
        <Link key="login" to={ROUTES.LOGIN}>
          <FormattedMessage id="header.nav.login" />
        </Link>
      ),
    ])
  }, [currentUser, hasAccess, orgId])

  return (
    <Navbar
      alignLinks="right"
      brand={<Link to="/">Checkinizer</Link>}
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
      className="z-1300 fixed"
    >
      {orgId ? (
        orgItems
      ) : currentUser ? (
        <Link to={ROUTES.LOGOUT}>
          <FormattedMessage id="header.nav.logout" />
        </Link>
      ) : (
        <Link to={ROUTES.LOGIN}>
          <FormattedMessage id="header.nav.login" />
        </Link>
      )}
    </Navbar>
  )
}

function ProfileButton() {
  const orgId = useOrgIdNotStrict()
  const { data } = useProfile()
  const { name = '' } = data?.data ?? {}
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }

  return (
    <>
      <IconButton
        onClick={handleClick}
        aria-controls={open ? 'account-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
      >
        <Avatar>{getInitials(name)}</Avatar>
      </IconButton>

      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem onClick={handleClose}>
          <ListItemIcon>
            <AccountCircleIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>
            <MenuLink key="logout" to={`/${orgId}${ROUTES.MY_WORK}`}>
              <FormattedMessage id="myWork.link.title" />
            </MenuLink>
          </ListItemText>
        </MenuItem>
        <MenuItem onClick={handleClose}>
          <ListItemIcon>
            <LogoutIcon fontSize="small" color="error" />
          </ListItemIcon>
          <ListItemText>
            <MenuLink key="logout" to={`/${orgId}${ROUTES.LOGOUT}`}>
              <Typography color="error">
                <FormattedMessage id="header.nav.logout" />
              </Typography>
            </MenuLink>
          </ListItemText>
        </MenuItem>
      </Menu>
    </>
  )
}

// TODO: move to appropriate place
function useProfile() {
  return useQuery(['myProfile'], () => getMyProfileRequest(), {
    refetchOnWindowFocus: false,
  })
}

function getInitials(name: string) {
  const [first, last] = name.split(' ')
  return `${first[0] ?? ''}${(last ?? '')[0] ?? ''}`.toUpperCase()
}

const MenuLink = styled(Link)`
  color: inherit;
`
