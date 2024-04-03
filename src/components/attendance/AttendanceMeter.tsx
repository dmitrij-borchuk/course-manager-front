import React from 'react'
import { FormattedMessage } from 'react-intl'
import { Box, IconButton, Paper, Typography, styled } from '@mui/material'
import EditIcon from '@mui/icons-material/Edit'
import { Activity } from 'types/activity'
import { Profile } from 'types/profile'
import { AttendanceRateBadge } from 'components/kit/attendanceRateBadge/AttendancerateBadge'
import { OrgLink } from 'components/routing/OrgLink'
import { ROUTES } from '../../constants'

interface Props {
  activity: Activity
  performer?: Profile
  rate?: number
  studentsNumber?: number
}
export const AttendanceMeter: React.FC<Props> = ({ activity, performer, rate = 0, studentsNumber = 0 }) => {
  return (
    <MeterContainer elevation={4} hoverShadow={7}>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <EllipsisTypography variant="h6" title={activity.name}>
          <CardLink to={`${ROUTES.GROUPS_ROOT}/${activity.id}`}>{activity.name}</CardLink>
        </EllipsisTypography>
        <Box display="flex" alignItems="center">
          <AttendanceRateBadge value={rate} />
          <Box className="editBtn">
            <IconButton size="small">
              <EditIcon />
            </IconButton>
          </Box>
        </Box>
      </Box>
      <Box display="flex" flexDirection="column" gap={2.5} mt={2}>
        <InfoItem gap={1}>
          <Typography>
            <FormattedMessage id="groups.teacher.title" />
          </Typography>
          {performer && (
            <BoldTypography title={performer.name}>
              <CardLink to={`${ROUTES.TEACHERS_ROOT}/${performer.id}`}>{performer.name}</CardLink>
            </BoldTypography>
          )}
        </InfoItem>
        <InfoItem gap={1}>
          <Typography>
            <FormattedMessage id="common.students" />
          </Typography>
          <BoldTypography>{studentsNumber}</BoldTypography>
        </InfoItem>
      </Box>
    </MeterContainer>
  )
}

const MeterContainer = styled(Paper, {
  shouldForwardProp: (prop) => prop !== 'hoverShadow',
})<{ hoverShadow: number }>`
  padding: ${({ theme }) => theme.spacing(2.5)};
  .editBtn {
    width: 0px;
    transition: width 0.2s, opacity 0.2s;
    opacity: 0;
    position: relative;
    display: flex;
    align-items: center;
  }
  .MuiIconButton-root {
    position: absolute;
    right: 0px;
  }
  &:hover {
    box-shadow: ${({ theme, hoverShadow }) => theme.shadows[hoverShadow]};
    .editBtn {
      width: 32px;
      opacity: 1;
    }
  }
`

const InfoItem = styled(Box)`
  display: flex;
  justify-content: space-between;
  align-items: center;
`
const EllipsisTypography = styled(Typography)`
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
`
const BoldTypography = styled(EllipsisTypography)`
  font-weight: bold;
`

const CardLink = styled(OrgLink)`
  color: ${({ theme }) => theme.palette.text.primary};
  text-decoration: underline;
`
