import React, { ReactNode, useMemo, useState } from 'react'
import { FormattedMessage } from 'react-intl'
import { Link, useLocation } from 'react-router-dom'
import Drawer, { drawerClasses } from '@mui/material/Drawer'
import { Collapse, styled, typographyClasses, useMediaQuery, useTheme } from '@mui/material'
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined'
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined'
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined'
import ArticleOutlinedIcon from '@mui/icons-material/ArticleOutlined'
import GroupsOutlinedIcon from '@mui/icons-material/GroupsOutlined'
import VpnKeyOutlinedIcon from '@mui/icons-material/VpnKeyOutlined'
import GroupOutlinedIcon from '@mui/icons-material/GroupOutlined'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemText from '@mui/material/ListItemText'
import ExpandLess from '@mui/icons-material/ExpandLess'
import ExpandMore from '@mui/icons-material/ExpandMore'
import ListItemIcon, { listItemIconClasses } from '@mui/material/ListItemIcon'
import ListItem from '@mui/material/ListItem'
import Toolbar from '@mui/material/Toolbar'
import List from '@mui/material/List'
import Box from '@mui/material/Box'
import { useAccessManager } from 'hooks/useAccessManager'
import { useAuthState } from 'store'
import { DRAWER_WIDTH } from 'config'
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

function useOrgItems() {
  const { currentUser } = useAuthState()
  const { hasAccess } = useAccessManager()
  const location = useLocation()
  const { pathname } = location

  return useMemo(() => {
    const items: JSX.Element[] = []

    if (currentUser) {
      items.push(
        <Link key="dashboard" to={`/`}>
          <NavItem
            label={<FormattedMessage id="header.nav.dashboard" />}
            icon={<DashboardOutlinedIcon />}
            active={`/` === pathname}
          />
        </Link>
      )
    }

    if (hasAccess('MANAGE_TEACHERS')) {
      items.push(
        <Link key="teachers" to={`${ROUTES.TEACHERS_LIST}`}>
          <NavItem
            label={<FormattedMessage id="header.nav.teachers" />}
            icon={<AccountCircleOutlinedIcon />}
            active={new RegExp(ROUTES.TEACHERS_LIST).test(pathname)}
          />
        </Link>
      )
    }
    if (hasAccess('MANAGE_GROUPS')) {
      items.push(
        <Link key="groups" to={`${ROUTES.GROUPS_LIST}`}>
          <NavItem
            label={<FormattedMessage id="header.nav.groups" />}
            icon={<GroupOutlinedIcon />}
            active={new RegExp(ROUTES.GROUPS_LIST).test(pathname)}
          />
        </Link>
      )
    }
    if (hasAccess('MANAGE_STUDENTS')) {
      items.push(
        <Link key="students" to={`${ROUTES.STUDENTS_LIST}`}>
          <NavItem
            label={<FormattedMessage id="header.nav.students" />}
            icon={<GroupsOutlinedIcon />}
            active={new RegExp(ROUTES.STUDENTS_LIST).test(pathname)}
          />
        </Link>
      )
    }
    if (hasAccess('VIEW_REPORTS')) {
      items.push(
        <Link key="reports" to={`${ROUTES.REPORTS_ROOT}`}>
          <NavItem
            label={<FormattedMessage id="header.nav.reports" />}
            icon={<ArticleOutlinedIcon />}
            active={new RegExp(ROUTES.REPORTS_ROOT).test(pathname)}
          />
        </Link>
      )
    }
    if (hasAccess('VIEW_SETTINGS')) {
      items.push(
        <Link key="settings" to={`${ROUTES.SETTINGS_API_KEY}`}>
          <NavItem
            label={<FormattedMessage id="header.nav.settings" />}
            icon={<SettingsOutlinedIcon />}
            active={new RegExp(ROUTES.SETTINGS_ROOT).test(pathname)}
            items={[
              {
                label: <FormattedMessage id="settings.nav.apiKey.label" />,
                icon: <VpnKeyOutlinedIcon />,
                active: new RegExp(ROUTES.SETTINGS_API_KEY).test(pathname),
              },
            ]}
          />
        </Link>
      )
    }

    return items
  }, [currentUser, hasAccess, pathname])
}

type NavItemProps = {
  label: ReactNode
  icon: ReactNode
  active?: boolean
  items?: NavItemProps[]
}
function NavItem({ label, icon, active = false, items = [] }: NavItemProps) {
  const showSubMenu = items.length > 0
  const [open, setOpen] = useState(false)

  return (
    <>
      <NavigationItem disablePadding active={active}>
        <ListItemButton onClick={() => setOpen((prev) => !prev)}>
          <ListItemIcon>{icon}</ListItemIcon>
          <ListItemText primary={label} />
          {showSubMenu && (open ? <ExpandLess /> : <ExpandMore />)}
        </ListItemButton>
      </NavigationItem>
      {showSubMenu && (
        <Collapse in={open} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            {items.map((item, index) => (
              <NavigationItem key={index} active={item.active ?? false}>
                <ListItemButton sx={{ pl: 4 }}>
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.label} />
                </ListItemButton>
              </NavigationItem>
            ))}
          </List>
        </Collapse>
      )}
    </>
  )
}

const AppDrawer = styled(Drawer)`
  width: ${DRAWER_WIDTH}px;
  flex-shrink: 0;
  & .${drawerClasses.paper} {
    width: ${DRAWER_WIDTH}px;
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

const NavigationItem = styled(ListItem, { shouldForwardProp: (prop: string) => !['active'].includes(prop) })<{
  active: boolean
}>`
  color: ${({ theme, active }) => (active ? theme.palette.primary.main : theme.palette.text.primary)};
  & .${typographyClasses.root} {
    font-weight: ${({ active }) => (active ? 'bold' : undefined)};
  }
  & .${listItemIconClasses.root} {
    color: ${({ theme, active }) => (active ? theme.palette.secondary.light : theme.palette.text.primary)};
  }
`
