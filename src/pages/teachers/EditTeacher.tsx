import { useMemo } from 'react'
import { useParams } from 'react-router-dom'
import { Message } from '../../components/kit/message/Message'
import { EditTeacher } from '../../components/teachers/EditTeacher'
import { useTeacher } from '../../hooks/useTeacher'
import { useEditTeacher } from '../../services/teachers'

export const EditTeacherPage = () => {
  let { id } = useParams<{ id: string }>()
  const { data: initialData } = useTeacher({ variables: { id } })
  const [update, loading] = useEditTeacher(initialData?.userInfo?.id)
  const formData = useMemo(() => {
    if (!initialData?.userInfo?.user) {
      return undefined
    }

    return {
      ...initialData.userInfo,
      email: initialData.userInfo.user.email,
    }
  }, [initialData?.userInfo])

  if (!formData) {
    // TODO: implement
    return <Message>404</Message>
  }

  // TODO: add loading overlay

  return <EditTeacher onSubmit={update} loading={loading} initial={formData} />
}
