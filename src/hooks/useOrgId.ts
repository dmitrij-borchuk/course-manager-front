import { useParams } from 'react-router-dom'

export function useOrgId() {
  const { orgId } = useParams<{ orgId?: string }>()

  if (!orgId) {
    throw new Error('Organization ID is not provided in the URL')
  }

  return orgId
}

export function useOrgIdNotStrict() {
  const { orgId } = useParams<{ orgId?: string }>()

  return orgId
}
