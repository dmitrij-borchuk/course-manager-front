import { MoreHoriz } from '@mui/icons-material'
import {
  Button,
  ButtonProps,
  IconButton,
  IconButtonProps,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  useMediaQuery,
  useTheme,
} from '@mui/material'
import React from 'react'

type Props = {
  items: Items
  dropMenuProps?: IconButtonProps
}
export function ResponsiveButtons({ items, dropMenuProps }: Props) {
  const theme = useTheme()
  const upMd = useMediaQuery(theme.breakpoints.up('md'))

  return (
    <>
      {upMd && (
        <div className="flex gap-3">
          {items.map((item) => (
            <Button
              key={item.id}
              className={`whitespace-nowrap flex-shrink-0`}
              variant="outlined"
              onClick={item.onClick}
              startIcon={item.icon}
              {...item.buttonProps}
            >
              {item.label}
            </Button>
          ))}
        </div>
      )}
      {!upMd && <DropMenu items={items} componentProps={dropMenuProps} />}
    </>
  )
}

type MenuProps = {
  items: Items
  componentProps?: IconButtonProps
}
function DropMenu({ items, componentProps }: MenuProps) {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
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
        sx={{
          borderRadius: '12px',
          backgroundColor: 'primary.main',
          color: 'primary.contrastText',
          '&:hover': {
            backgroundColor: 'primary.light',
          },
        }}
        {...componentProps}
      >
        <MoreHoriz />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
        onClick={handleClose}
      >
        {items.map((item) => (
          <MenuItem key={item.id} onClick={item.onClick}>
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText>{item.label}</ListItemText>
          </MenuItem>
        ))}
      </Menu>
    </>
  )
}

type Items = Array<{
  id: string
  label: React.ReactNode
  onClick?: () => void
  icon?: React.ReactNode
  buttonProps?: ButtonProps
}>
