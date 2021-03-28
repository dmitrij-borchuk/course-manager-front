import { useEffect, useMemo } from 'react'
import { useParams } from 'react-router-dom'
import { Teacher } from '../../components/teachers/Teacher'
import { useGroupsState, useTeachersState } from '../../store'

// TODO: Add loading skeleton
export const TeacherPage = () => {
  let { id } = useParams<{ id: string }>()
  const { fetchTeacher, setTeacher, teachersById } = useTeachersState()
  // TODO: add loading
  const { fetchGroups, groups } = useGroupsState()
  const teacher = teachersById[id]
  const groupsOfTeacher = useMemo(() => {
    if (!teacher?.user_info?.id) {
      return []
    }

    return groups.filter((g) => g.teacher?.id === teacher.user_info?.id)
  }, [groups, teacher])

  useEffect(() => {
    fetchTeacher(id)
    fetchGroups(id)

    return () => {
      setTeacher(id, undefined)
    }
  }, [fetchGroups, fetchTeacher, id, setTeacher])

  if (!teacher) {
    // TODO: Implement
    return <div>Loading</div>
  }

  // TODO: 404

  return <Teacher data={teacher} groups={groupsOfTeacher} />
}
