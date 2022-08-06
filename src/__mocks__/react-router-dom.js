export const useParams = jest.fn()
export const useHistory = () => ({
  push: jest.fn(),
})
export const Link = ({ children, ...props }) => <a {...props}>{children}</a>
export const BrowserRouter = ({ children }) => <div>{children}</div>
export const Switch = jest.fn()
export const Route = jest.fn()
