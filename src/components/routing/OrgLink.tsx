import { Link, LinkProps } from 'react-router-dom'

// TODO: probably we don't need this component at all
export function OrgLink({ to, ...props }: LinkProps) {
  return <Link {...props} to={`${to}`} />
}
