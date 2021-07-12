import { useParams } from 'react-router-dom'

export function useOrgId() {
  const { orgId } = useParams<{ orgId?: string }>()

  return orgId
}
