import { useCallback, useEffect, useMemo } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import { Helmet } from 'react-helmet'
import { Loader } from '../../components/kit/loader/Loader'
import { EditTeacher, TeacherFormOutput } from '../../components/teachers/EditTeacher'
import { ROUTES } from '../../constants'
import { useOrgId } from '../../hooks/useOrgId'
import { useTeachersState } from '../../store'
import { TITLE_POSTFIX } from '../../config'

export const EditTeacherPage = () => {
  const history = useHistory()
  const orgId = useOrgId()
  let { id } = useParams<{ id: string }>()
  const { fetchTeacher, editTeacher, fetching, submitting, teachersById } = useTeachersState()
  const teacher = teachersById[id]
  const update = useCallback(
    async (data: TeacherFormOutput) => {
      if (orgId) {
        await editTeacher(orgId, {
          ...teacher,
          ...data,
        })

        history.push(`/${orgId}/${ROUTES.TEACHERS_ROOT}/${id}`)
      }
    },
    [editTeacher, history, id, orgId, teacher]
  )
  const formData = useMemo(() => {
    return {
      ...teacher,
      // email: teacher.user?.email,
      // username: teacher.user?.username,
    } as any
  }, [teacher])

  useEffect(() => {
    if (orgId) {
      fetchTeacher(orgId, id)
    }
  }, [fetchTeacher, id, orgId])
  // TODO: implement 404

  return (
    <>
      <Helmet>
        <title>Edit Teacher{TITLE_POSTFIX}</title>
      </Helmet>

      <Loader show={fetching}>
        <EditTeacher onSubmit={update} loading={submitting} initial={formData} isEdit />
      </Loader>
    </>
  )
}
