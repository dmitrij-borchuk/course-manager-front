import { useEffect } from 'react'
import { TeachersList } from '../../components/teachers/TeachersList'
import { useTeachersState } from '../../store'

export const TeachersListPage = () => {
  const { teachers, fetchTeachers, fetching } = useTeachersState()

  useEffect(() => {
    fetchTeachers()
  }, [fetchTeachers])

  return <TeachersList items={teachers} loading={fetching} />
}
