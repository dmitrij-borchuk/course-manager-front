import { CircularProgress } from '@mui/material'
import { ComponentProps, FC } from 'react'

interface Props {
  className?: string
  show?: boolean
}
export const Loader: FC<Props & ComponentProps<'div'>> = ({ children, className = '', show = true, ...props }) => {
  return (
    <div className={` ${className}`} data-testid="loader-wrapper" {...props}>
      {children}
      {show && (
        <div
          className="absolute top-0 left-0 w-screen h-screen flex justify-center items-center bg-opacity-30 bg-black z-10"
          data-testid="loader-spinner"
        >
          <CircularProgress />
        </div>
      )}
    </div>
  )
}
