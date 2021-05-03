import { useCallback, useEffect, useMemo } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import { Loader } from '../../components/kit/loader/Loader'
import { EditTeacher, TeacherFormOutput } from '../../components/teachers/EditTeacher'
import { ROUTES } from '../../constants'
import { useTeachersState } from '../../store'

export const EditTeacherPage = () => {
  const history = useHistory()
  let { id } = useParams<{ id: string }>()
  const { fetchTeacher, editTeacher, fetching, submitting, teachersById } = useTeachersState()
  const teacher = teachersById[id]
  const update = useCallback(
    async (data: TeacherFormOutput) => {
      await editTeacher({
        ...teacher,
        user: teacher.user?.id,
        groups: teacher.groups?.map((g) => g.id),
        ...data,
      })

      history.push(`${ROUTES.TEACHERS_ROOT}/${id}`)
    },
    [editTeacher, history, id, teacher]
  )
  const formData = useMemo(() => {
    return {
      ...teacher,
      email: teacher.user?.email,
      username: teacher.user?.username,
    } as any
  }, [teacher])

  useEffect(() => {
    fetchTeacher(id)
  }, [fetchTeacher, id])
  // TODO: implement 404

  return (
    <Loader show={fetching}>
      <EditTeacher onSubmit={update} loading={submitting} initial={formData} isEdit />
    </Loader>
  )
}
