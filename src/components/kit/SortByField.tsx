import { Button, ButtonGroup, ClickAwayListener, Grow, MenuItem, MenuList, Paper, Popper } from '@mui/material'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'
import { useCallback, useRef, useState } from 'react'
import { SortOrder } from 'utils/sorting'
import { SortAscIcon, SortDescIcon } from './icons/SortIcon'

type OrderBy = {
  order: SortOrder
  orderBy: string
}
type Option = { value: string; label: string }
type Props = {
  onChange?: (value: OrderBy) => void
  value: OrderBy
  options?: Option[]
}
export function SortByField({ onChange, value, options = [] }: Props) {
  const onSortOrderChange = useCallback(() => {
    onChange?.({
      order: value.order === 'asc' ? 'desc' : 'asc',
      orderBy: value.orderBy,
    })
  }, [onChange, value.order, value.orderBy])
  const currentOption = options.find((o) => o.value === value.orderBy) ?? options[0]

  const [open, setOpen] = useState(false)
  const anchorRef = useRef<HTMLDivElement>(null)

  const handleMenuItemClick = (event: React.MouseEvent<HTMLLIElement, MouseEvent>, option: Option) => {
    onChange?.({
      order: value.order,
      orderBy: option.value,
    })
    setOpen(false)
  }

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen)
  }

  const handleClose = (event: Event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target as HTMLElement)) {
      return
    }

    setOpen(false)
  }

  return (
    <>
      <ButtonGroup variant="contained" ref={anchorRef} aria-label="split button" fullWidth>
        <Button size="small" onClick={onSortOrderChange} sx={{ width: 'auto' }}>
          {value.order === 'asc' ? <SortAscIcon /> : <SortDescIcon />}
        </Button>
        <Button
          aria-controls={open ? 'split-button-menu' : undefined}
          aria-expanded={open ? 'true' : undefined}
          aria-label="select merge strategy"
          aria-haspopup="menu"
          onClick={handleToggle}
          endIcon={<ArrowDropDownIcon />}
        >
          {currentOption?.label}
        </Button>
      </ButtonGroup>
      <Popper
        sx={{
          zIndex: 1,
        }}
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
        transition
        disablePortal
      >
        {({ TransitionProps, placement }) => (
          <Grow
            {...TransitionProps}
            style={{
              transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom',
            }}
          >
            <Paper>
              <ClickAwayListener onClickAway={handleClose}>
                <MenuList id="split-button-menu" autoFocusItem>
                  {options.map((option, index) => (
                    <MenuItem
                      key={option.value}
                      selected={option.value === value.orderBy}
                      onClick={(event) => handleMenuItemClick(event, option)}
                    >
                      {option?.label}
                    </MenuItem>
                  ))}
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
    </>
  )
}
