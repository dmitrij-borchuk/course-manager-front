import { IconButton } from './IconButton'
import ChevronRight from '@mui/icons-material/ChevronRight'

export type SortButtonProps = {
  order?: 'asc' | 'desc'
}
export function SortButton({ order }: SortButtonProps) {
  return (
    <IconButton
      sx={{
        rotate: order === 'asc' ? '90deg' : '-90deg',
        scale: order === undefined ? '0' : '',
        width: order === undefined ? '0px' : '38px',
        transition: 'all 0.2s',
      }}
    >
      <ChevronRight />
    </IconButton>
  )
}
