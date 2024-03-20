import React from 'react'
import Box from '@mui/material/Box'
import { AttendanceDateBlock } from './AttendanceDateBlock'
import { Link } from 'react-router-dom'
import { useOrgId } from 'hooks/useOrgId'
import { ROUTES } from '../../constants'
import { AttendanceMeter } from './AttendanceMeter'
// eslint-disable-next-line no-restricted-imports
import Grid2 from '@mui/material/Unstable_Grid2/Grid2'
import { Activity } from 'types/activity'
import { Profile } from 'types/profile'
import { Divider } from '@mui/material'

interface Props {
  items?: {
    date: Date
    items: {
      id: string
      activity: Activity
      performer?: Profile
      rate?: number
      studentsNumber?: number
    }[]
  }[]
  className?: string
}
export const AttendanceTimeLine: React.FC<Props> = ({ className = '', items = [] }) => {
  const orgId = useOrgId()

  return (
    <div className={`${className} mt-3`}>
      {items.map((item) => (
        <Box key={item.date.toISOString()}>
          <Box display="flex" flexDirection={{ xs: 'column', sm: 'row' }} gap={2.5}>
            <AttendanceDateBlock date={item.date} />
            <Grid2 container width="100%" spacing={1}>
              {item.items.map((item) => (
                <Grid2 key={item.id} xs={12} md={6} lg={4}>
                  <Link to={`/${orgId}${ROUTES.ATTENDANCE_EDIT}/${item.id}`}>
                    <AttendanceMeter {...item} />
                  </Link>
                </Grid2>
              ))}
            </Grid2>
          </Box>
          <Box my={2.5}>
            <Divider />
          </Box>
        </Box>
      ))}
    </div>
  )
}
