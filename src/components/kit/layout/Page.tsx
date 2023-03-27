import { Box, Container } from '@mui/material'

type Props = {
  children: React.ReactNode
}
export function PageLayout({ children }: Props) {
  return (
    <Container>
      <Box my={2}>{children}</Box>
    </Container>
  )
}
