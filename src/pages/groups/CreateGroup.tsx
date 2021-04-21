import { useCallback } from 'react'
import { EditGroup, GroupForm } from '../../components/groups/EditGroup'
import { Loader } from '../../components/kit/loader/Loader'
import { useGroupsState } from '../../store'

export const CreateGroupPage = () => {
  const { createGroup, fetching, submitting } = useGroupsState()
  const submit = useCallback(
    async (data: GroupForm) => {
      await createGroup({
        ...data,
      })
    },
    [createGroup]
  )

  return (
    <Loader show={fetching}>
      <EditGroup onSubmit={submit} loading={submitting} />
    </Loader>
  )
}

export default CreateGroupPage
