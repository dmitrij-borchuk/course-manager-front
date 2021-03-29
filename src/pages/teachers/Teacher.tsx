import React, { useEffect, useMemo } from 'react'
import { useParams } from 'react-router-dom'
import { Header } from '../../components/kit/header/Header'
import { Loader } from '../../components/kit/loader/Loader'
import { Teacher } from '../../components/teachers/Teacher'
import { useGroupsState, useTeachersState } from '../../store'

// TODO: Add loading skeleton
export const TeacherPage = () => {
  let { id } = useParams<{ id: string }>()
  const { fetchTeacher, setTeacher, teachersById, fetching } = useTeachersState()
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
    fetchGroups({
      teacherId: id,
    })

    return () => {
      setTeacher(id, undefined)
    }
  }, [fetchGroups, fetchTeacher, id, setTeacher])

  // TODO: 404

  return (
    <>
      <Header />
      {/* TODO: skeleton loader */}
      <Loader show={fetching}>{teacher && <Teacher data={teacher} groups={groupsOfTeacher} />}</Loader>
    </>
  )
}
