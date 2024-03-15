import { CircularProgress } from '@mui/material'
import './styles.css'

interface Props {
  className?: string
}
export const TinyPreloader = ({ className }: Props) => {
  return (
    <div className={`tiny-preloader ${className}`}>
      <CircularProgress size={15} />
    </div>
  )
}
