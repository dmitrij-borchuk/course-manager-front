import { useCallback, useEffect, useMemo } from 'react'
import { useParams } from 'react-router-dom'
import { Message } from '../../components/kit/message/Message'
import { EditTeacher } from '../../components/teachers/EditTeacher'
import { useTeachersState } from '../../store'

export const EditTeacherPage = () => {
  let { id } = useParams<{ id: string }>()
  const { fetchTeacher, setTeacher, loading, teachersById } = useTeachersState()
  const update = useCallback(() => {}, [])
  const teacher = teachersById[id]
  const formData = useMemo(() => {
    if (!teacher?.user_info?.user) {
      return undefined
    }

    return {
      ...teacher.user_info,
      email: teacher.user_info.user.email,
      // TODO
      // username: teacher.userInfo.user.username,
    } as any
  }, [teacher?.user_info])

  useEffect(() => {
    fetchTeacher(id)

    return () => {
      setTeacher(id, undefined)
    }
  }, [fetchTeacher, id, setTeacher])

  if (!formData) {
    // TODO: implement
    return <Message>404</Message>
  }

  // TODO: add loading overlay

  return <EditTeacher onSubmit={update} loading={loading} initial={formData} />
}
