import React from 'react'
import { FormattedMessage } from 'react-intl'
import { Box, Paper, Typography, styled } from '@mui/material'
import { Activity } from 'types/activity'
import { Profile } from 'types/profile'
import { AttendanceRateBadge } from 'components/kit/attendanceRateBadge/AttendancerateBadge'
import { Ellipsis } from '../kit/ellipsis/Ellipsis'

interface Props {
  activity: Activity
  performer?: Profile
  rate?: number
  studentsNumber?: number
}
export const AttendanceMeter: React.FC<Props> = ({ activity, performer, rate = 0, studentsNumber = 0 }) => {
  return (
    <MeterContainer elevation={5}>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Ellipsis className="z-10">
          <Typography variant="h6">{activity.name}</Typography>
        </Ellipsis>
        <AttendanceRateBadge value={rate} />
      </Box>
      <Box display="flex" flexDirection="column" gap={2.5} mt={2}>
        <InfoItem>
          <Typography>
            <FormattedMessage id="groups.teacher.title" />
          </Typography>
          <Typography>{performer?.name}</Typography>
        </InfoItem>
        <InfoItem>
          <Typography>
            <FormattedMessage id="common.students" />
          </Typography>
          <Typography>{studentsNumber}</Typography>
        </InfoItem>
      </Box>
    </MeterContainer>
  )
}

const MeterContainer = styled(Paper)`
  padding: ${({ theme }) => theme.spacing(2.5)};
`

const InfoItem = styled(Box)`
  display: flex;
  justify-content: space-between;
  align-items: center;
`
