import Tooltip from '@mui/material/Tooltip'
import { FormattedRelativeTime } from 'react-intl'

type Props = { date: Date; updateInterval?: number }
export function RelativeTime({ date, updateInterval }: Props) {
  const { value, unit } = selectUnit(date)
  return (
    <Tooltip title={date.toLocaleString()}>
      <span style={{ cursor: 'pointer' }}>
        <FormattedRelativeTime value={value} numeric="auto" unit={unit} updateIntervalInSeconds={updateInterval} />
      </span>
    </Tooltip>
  )
}

function selectUnit(date: Date): { value: number; unit: 'second' | 'minute' | 'hour' | 'day' | 'year' } {
  const diff = date.getTime() - Date.now()
  const absDiff = Math.abs(diff)
  if (absDiff < 60 * 1000) {
    return { value: Math.round(diff / 1000), unit: 'second' }
  }
  if (absDiff < 60 * 60 * 1000) {
    return { value: Math.round(diff / 1000 / 60), unit: 'minute' }
  }
  if (absDiff < 24 * 60 * 60 * 1000) {
    return { value: Math.round(diff / 1000 / 60 / 60), unit: 'hour' }
  }
  if (absDiff < 30 * 24 * 60 * 60 * 1000) {
    return { value: Math.round(diff / 1000 / 60 / 60 / 24), unit: 'day' }
  }
  return { value: Math.round(diff / 1000 / 60 / 60 / 24 / 365), unit: 'year' }
}
