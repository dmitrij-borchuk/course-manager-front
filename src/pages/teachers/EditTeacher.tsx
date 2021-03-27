import { useCallback, useEffect, useMemo } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import { Message } from '../../components/kit/message/Message'
import { EditTeacher, TeacherFormOutput } from '../../components/teachers/EditTeacher'
import { ROUTES } from '../../constants'
import { useTeachersState } from '../../store'

export const EditTeacherPage = () => {
  const history = useHistory()
  let { id } = useParams<{ id: string }>()
  const { fetchTeacher, setTeacher, editTeacher, loading, teachersById } = useTeachersState()
  const teacher = teachersById[id]
  const update = useCallback(
    async (data: TeacherFormOutput) => {
      if (!teacher?.user_info) {
        // TODO: show error
        return undefined
      }

      await editTeacher({
        ...teacher,
        user_info: {
          ...teacher.user_info,
          ...data,
        },
      })

      history.push(`${ROUTES.TEACHERS_ROOT}/${id}`)
    },
    [editTeacher, history, id, teacher]
  )
  const formData = useMemo(() => {
    if (!teacher?.user_info) {
      return undefined
    }

    return {
      ...teacher.user_info,
      email: teacher.email,
      username: teacher.username,
    } as any
  }, [teacher])

  useEffect(() => {
    fetchTeacher(id)

    return () => {
      setTeacher(id, undefined)
    }
  }, [fetchTeacher, id, setTeacher])

  if (loading) {
    // TODO: implement
    // TODO: add loading overlay
    return <Message>loading</Message>
  }

  if (!formData) {
    // TODO: implement
    return <Message>404</Message>
  }

  return <EditTeacher onSubmit={update} loading={loading} initial={formData} />
}
