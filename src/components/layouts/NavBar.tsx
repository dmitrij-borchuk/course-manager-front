import React, { ReactNode, useMemo } from 'react'
import { FormattedMessage } from 'react-intl'
import { Link } from 'react-router-dom'
import Drawer, { drawerClasses } from '@mui/material/Drawer'
import { styled, useMediaQuery, useTheme } from '@mui/material'
import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import ListItemButton from '@mui/material/ListItemButton'
import AssessmentIcon from '@mui/icons-material/Assessment'
import DashboardIcon from '@mui/icons-material/Dashboard'
import ListItemText from '@mui/material/ListItemText'
import ListItemIcon from '@mui/material/ListItemIcon'
import GroupsIcon from '@mui/icons-material/Groups'
import GroupIcon from '@mui/icons-material/Group'
import ListItem from '@mui/material/ListItem'
import Toolbar from '@mui/material/Toolbar'
import List from '@mui/material/List'
import Box from '@mui/material/Box'
import { useOrgIdNotStrict } from 'hooks/useOrgId'
import { useAccessManager } from 'hooks/useAccessManager'
import { useAuthStore } from 'store/authStore'
import { ROUTES } from '../../constants'

export function NavBar() {
  const { open, toggle } = useNavBarContext()
  const breakpoints = useTheme().breakpoints
  const isMobile = useMediaQuery(breakpoints.down('md'))

  return (
    <>
      <AppDrawer variant={isMobile ? 'temporary' : 'permanent'} open={open} onClose={() => toggle(false)}>
        {/* To make some gap under the header */}
        <Toolbar />

        <Box sx={{ overflow: 'auto' }}>
          <List>{useOrgItems()}</List>
        </Box>
      </AppDrawer>
    </>
  )
}

// TODO: highlight active item
function useOrgItems() {
  const { currentUser } = useAuthStore()
  const orgId = useOrgIdNotStrict()
  const { hasAccess } = useAccessManager()
  return useMemo(() => {
    const items: JSX.Element[] = []

    if (currentUser) {
      items.push(
        <Link key="dashboard" to={`/${orgId}`}>
          <NavItem label={<FormattedMessage id="header.nav.dashboard" />} icon={<DashboardIcon />} />
        </Link>
      )
    }

    if (hasAccess('MANAGE_TEACHERS')) {
      items.push(
        <Link key="teachers" to={`/${orgId}${ROUTES.TEACHERS_LIST}`}>
          <NavItem label={<FormattedMessage id="header.nav.teachers" />} icon={<AccountCircleIcon />} />
        </Link>
      )
    }
    if (hasAccess('MANAGE_GROUPS')) {
      items.push(
        <Link key="groups" to={`/${orgId}${ROUTES.GROUPS_LIST}`}>
          <NavItem label={<FormattedMessage id="header.nav.groups" />} icon={<GroupIcon />} />
        </Link>
      )
    }
    if (hasAccess('MANAGE_STUDENTS')) {
      items.push(
        <Link key="students" to={`/${orgId}${ROUTES.STUDENTS_LIST}`}>
          <NavItem label={<FormattedMessage id="header.nav.students" />} icon={<GroupsIcon />} />
        </Link>
      )
    }
    if (hasAccess('VIEW_REPORTS')) {
      items.push(
        <Link key="reports" to={`/${orgId}${ROUTES.REPORTS_ROOT}`}>
          <NavItem label={<FormattedMessage id="header.nav.reports" />} icon={<AssessmentIcon />} />
        </Link>
      )
    }

    return items
  }, [currentUser, hasAccess, orgId])
}

type NavItemProps = {
  label: ReactNode
  icon: ReactNode
}
function NavItem({ label, icon }: NavItemProps) {
  const theme = useTheme()
  return (
    <ListItem disablePadding>
      <ListItemButton>
        <ListItemIcon>{icon}</ListItemIcon>
        <ListItemText primary={label} sx={{ color: theme.palette.text.primary }} />
      </ListItemButton>
    </ListItem>
  )
}

const AppDrawer = styled(Drawer)`
  width: 240px;
  flex-shrink: 0;
  & .${drawerClasses.paper} {
    width: 240px;
    box-sizing: border-box;
  }
`

export const navBarContext = React.createContext({
  open: false,
  toggle: (value?: boolean) => {},
})

export function useNavBarContext() {
  return React.useContext(navBarContext)
}

export function NavBarProvider({ children }: { children?: ReactNode }) {
  const [open, setOpen] = React.useState(false)
  const toggle = (value?: boolean) => {
    setOpen(value ?? !open)
  }
  return <navBarContext.Provider value={{ open, toggle }}>{children}</navBarContext.Provider>
}
