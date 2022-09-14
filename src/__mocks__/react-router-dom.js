import React from 'react'

export const useParams = jest.fn()
export const useHistory = () => ({
  push: jest.fn(),
})
export const Link = React.forwardRef(({ children, ...props }, ref) => (
  <a ref={ref} {...props}>
    {children}
  </a>
))
export const BrowserRouter = ({ children }) => <div>{children}</div>
export const Switch = jest.fn()
export const Route = jest.fn()
