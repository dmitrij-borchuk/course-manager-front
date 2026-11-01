import React from 'react'

export const useParams = vi.fn()
export const useHistory = vi.fn(() => ({
  push: vi.fn(),
  replace: vi.fn(),
  location: {
    search: '',
  },
}))
export const useLocation = vi.fn(() => ({
  search: '',
}))
export const Link = React.forwardRef(({ children, ...props }, ref) => (
  <a ref={ref} {...props}>
    {children}
  </a>
))
export const BrowserRouter = ({ children }) => <div>{children}</div>
export const Switch = vi.fn()
export const Route = vi.fn()
