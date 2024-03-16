import React from 'react'
import { FormattedDate } from 'react-intl'
import { Box, Paper, Typography, styled } from '@mui/material'

interface Props {
  date: Date
}
export const AttendanceDateBlock: React.FC<Props> = ({ date }) => {
  return (
    <DateBlockContainer>
      <Box display="flex" flexDirection="column" alignItems="end">
        <PaperTypography variant="h6">
          <FormattedDate value={date} month="short" />
        </PaperTypography>
        <Typography variant="h3" color="action.active" sx={{ mt: -1.25, fontWeight: 'bold' }}>
          {date.getDate()}
        </Typography>
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
  display: flex;
  border-radius: ${({ theme }) => theme.spacing(1.5)};
  flex-direction: column;
  padding: ${({ theme }) => theme.spacing(1.5)};
`

const PaperTypography = styled(Typography)`
  color: ${({ theme }) => theme.palette.primary.contrastText};
`
