import { Box, Button, ButtonProps, styled } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'

export function AddButton({ children, ...props }: ButtonProps) {
  return (
    <ResponsiveButton variant="contained" {...props}>
      <ResponsiveIcon />
      <HiddenOnSmallScreen>{children}</HiddenOnSmallScreen>
    </ResponsiveButton>
  )
}

const HiddenOnSmallScreen = styled(Box)`
  ${({ theme }) => theme.breakpoints.down('sm')} {
    display: none;
  }
`
const ResponsiveIcon = styled(AddIcon)`
  ${({ theme }) => theme.breakpoints.up('sm')} {
    margin-left: -0.5rem;
    margin-right: 0.5rem;
  }
`
const ResponsiveButton = styled(Button)`
  ${({ theme }) => theme.breakpoints.down('sm')} {
    min-width: 0;
    padding-left: ${({ theme }) => theme.spacing(1)};
    padding-right: ${({ theme }) => theme.spacing(1)};
  }
`
