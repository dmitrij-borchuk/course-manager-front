import { useOrgId } from 'hooks/useOrgId'
import { Link, LinkProps } from 'react-router-dom'

export function OrgLink({ to, ...props }: LinkProps) {
  const orgKey = useOrgId()

  return <Link {...props} to={`/${orgKey}${to}`} />
}
