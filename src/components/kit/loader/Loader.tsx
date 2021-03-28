import { FC } from 'react'
import { Preloader } from 'react-materialize'

interface Props {
  className?: string
  show?: boolean
}
export const Loader: FC<Props> = ({ children, className = '', show = true }) => {
  return (
    <div className={`relative ${className}`}>
      {children}
      {show && (
        <div className="absolute top-0 left-0 w-screen h-screen flex justify-center items-center bg-opacity-30 bg-black z-10">
          <Preloader color="red" flashing={false} size="medium" />
        </div>
      )}
    </div>
  )
}
