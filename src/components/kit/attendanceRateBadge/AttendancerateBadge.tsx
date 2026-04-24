import { Box, BoxProps } from '@mui/material'

interface Props {
  value: number // 0 - 1
  BoxProps?: BoxProps
}
export const AttendanceRateBadge = ({ value, BoxProps }: Props) => {
  return (
    <Box
      className="w-10 h-6 flex-shrink-0 inline-flex justify-center"
      data-testid="attendance-rate-badge"
      {...BoxProps}
      sx={[
        {
          color: useBadgeColor(value),
          fontWeight: 'bold',
        },
        ...(Array.isArray(BoxProps?.sx) ? BoxProps.sx : [BoxProps?.sx]),
      ]}
    >
      {Math.round(value * 100)}%
    </Box>
  )
}

const colors = {
  low: '#F44336',
  medium: '#FFC12D',
  high: '#25A55F',
}

function useBadgeColor(value: number) {
  if (value >= 0.7) {
    return colors.high
  }
  if (value >= 0.45) {
    return colors.medium
  }
  return colors.low
}
