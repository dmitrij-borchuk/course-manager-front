import React from 'react'
import { FormattedDate } from 'react-intl'
import { Box, Paper, Typography, styled } from '@mui/material'

interface Props {
  date: Date
}
export const AttendanceDateBlock: React.FC<Props> = ({ date }) => {
  return (
    <DateBlockContainer>
      <Box
        display="flex"
        flexDirection={{ xs: 'row', sm: 'column' }}
        alignItems={{ xs: 'center', sm: 'end' }}
        justifyContent={{ xs: 'space-between', sm: 'start' }}
      >
        <Box display="flex" flexDirection={{ xs: 'row', sm: 'column' }} alignItems={{ xs: 'center', sm: 'end' }}>
          <PaperTypography variant="h6">
            <FormattedDate value={date} month="short" />
          </PaperTypography>
          <DateTypography variant="h3" sx={{ mt: -1.25, fontWeight: 'bold' }}>
            {date.getDate()}
          </DateTypography>
        </Box>
        <PaperTypography variant="subtitle1" sx={{ mt: -1 }}>
          <FormattedDate value={date} weekday="short" />
        </PaperTypography>
      </Box>
    </DateBlockContainer>
  )
}

const DateBlockContainer = styled(Paper)`
  background-color: ${({ theme }) => theme.palette.primary.main};
  width: 84px;
  ${({ theme }) => theme.breakpoints.down('sm')} {
    width: 100%;
  }
  display: flex;
  border-radius: ${({ theme }) => theme.spacing(1.5)};
  flex-direction: column;
  padding: ${({ theme }) => theme.spacing(1.5)};
  flex-shrink: 0;
`

const PaperTypography = styled(Typography)`
  color: ${({ theme }) => theme.palette.primary.contrastText};
  ${({ theme }) => theme.breakpoints.down('sm')} {
    font-size: 1.5rem;
    line-height: 1.5rem;
    margin-top: 0;
  }
`

const DateTypography = styled(Typography)`
  color: ${({ theme }) => theme.palette.accent.main};
  ${({ theme }) => theme.breakpoints.down('sm')} {
    font-size: 1.5rem;
    line-height: 1.5rem;
    margin-top: 0;
    margin-left: 0.5rem;
  }
`
