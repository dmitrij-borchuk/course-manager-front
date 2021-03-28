import { useCallback, useEffect, useMemo } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import { Loader } from '../../components/kit/loader/Loader'
import { EditTeacher, TeacherFormOutput } from '../../components/teachers/EditTeacher'
import { ROUTES } from '../../constants'
import { useTeachersState } from '../../store'

export const EditTeacherPage = () => {
  const history = useHistory()
  let { id } = useParams<{ id: string }>()
  const { fetchTeacher, setTeacher, editTeacher, fetching, submitting, teachersById } = useTeachersState()
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
  // TODO: implement 404

  return (
    <Loader show={fetching}>
      <EditTeacher onSubmit={update} loading={submitting} initial={formData} isEdit />
    </Loader>
  )
}
