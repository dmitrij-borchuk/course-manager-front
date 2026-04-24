import React from 'react'
import { Link } from 'react-router-dom'
import { Divider } from '@mui/material'
import Box from '@mui/material/Box'
import { Activity } from 'types/activity'
import { Profile } from 'types/profile'
import { Grid } from '@/atoms/layout'
import { AttendanceDateBlock } from './AttendanceDateBlock'
import { AttendanceMeter } from './AttendanceMeter'
import { ROUTES } from '../../constants'

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
  return (
    <div className={`${className} mt-3`}>
      {items.map((item) => (
        <Box key={item.date.toISOString()}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              gap: 2.5,
            }}
          >
            <AttendanceDateBlock date={item.date} />
            <Grid container sx={{ width: '100%', margin: 0 }} spacing={1}>
              {item.items.map((item) => (
                <Grid
                  key={item.id}
                  size={{
                    xs: 12,
                    md: 6,
                    lg: 4,
                  }}
                >
                  <Link to={`${ROUTES.ATTENDANCE_EDIT}/${item.id}`}>
                    <AttendanceMeter {...item} />
                  </Link>
                </Grid>
              ))}
            </Grid>
          </Box>
          <Box
            sx={{
              my: 2.5,
            }}
          >
            <Divider />
          </Box>
        </Box>
      ))}
    </div>
  )
}
