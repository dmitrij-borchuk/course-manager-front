import { useParams } from 'react-router-dom'
import { Group } from '../../components/groups/Group'
import { useGroup } from '../../hooks/useGroup'

// TODO: Add loading skeleton
export const GroupPage = () => {
  let { id } = useParams<{ id: string }>()
  const { data, loading } = useGroup({ variables: { id } })

  if (!data?.group) {
    return <div>Loading</div>
  }

  return <Group data={data?.group} />
}
