import { Box, BoxProps } from '@mui/material'

interface Props {
  value: number // 0 - 1
  BoxProps?: BoxProps
}
export const AttendanceRateBadge = ({ value, BoxProps }: Props) => {
  return (
    <Box
      // TODO: color depends on rate
      className="w-10 h-6 flex-shrink-0 inline-flex justify-center"
      data-testid="attendance-rate-badge"
      color={useBadgeColor(value)}
      fontWeight="bold"
      {...BoxProps}
    >
      {Math.round(value * 100)}%
    </Box>
  )
}

const colors = {
  low: '#434242',
  medium: '#FFC12D',
  high: '#F44336',
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
