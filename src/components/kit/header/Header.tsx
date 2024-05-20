import React from 'react'
import { FormattedMessage } from 'react-intl'
import { useQuery } from 'react-query'
import { Link } from 'react-router-dom'
import {
  AppBar,
  Avatar,
  Box,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
  styled,
} from '@mui/material'
import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import MenuIcon from '@mui/icons-material/Menu'
import LogoutIcon from '@mui/icons-material/Logout'
import { useNavBarContext } from 'components/layouts/NavBar'
import { getMyProfileRequest } from 'modules/profiles/api'
import { ROUTES } from '../../../constants'

// TODO: use logo

export const Header = () => {
  const { toggle } = useNavBarContext()

  return (
    <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
      <Toolbar>
        <IconButton
          size="large"
          edge="start"
          color="inherit"
          aria-label="menu"
          sx={{ mr: 2, display: { md: 'none' } }}
          onClick={() => toggle()}
        >
          <MenuIcon />
        </IconButton>
        <Box display="flex" sx={{ flexGrow: 1, color: 'white' }}>
          <FlexLink to="/">
            <img src={`${process.env.PUBLIC_URL}/logoWithName.png`} alt="logo" />
          </FlexLink>
        </Box>
        <ProfileButton />
      </Toolbar>
    </AppBar>
  )
}

function ProfileButton() {
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
        <MenuLink key="profile" to={`${ROUTES.MY_WORK}`}>
          <MenuItem onClick={handleClose}>
            <ListItemIcon>
              <AccountCircleIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>
              <FormattedMessage id="myWork.link.title" />
            </ListItemText>
          </MenuItem>
        </MenuLink>
        <MenuLink key="logout" to={`${ROUTES.LOGOUT}`}>
          <MenuItem onClick={handleClose}>
            <ListItemIcon>
              <LogoutIcon fontSize="small" color="error" />
            </ListItemIcon>
            <ListItemText>
              <Typography color="error">
                <FormattedMessage id="header.nav.logout" />
              </Typography>
            </ListItemText>
          </MenuItem>
        </MenuLink>
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

const FlexLink = styled(Link)`
  display: flex;
`
