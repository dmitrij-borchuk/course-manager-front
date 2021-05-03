import React, { useCallback, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { Header } from '../../components/kit/header/Header'
import { Loader } from '../../components/kit/loader/Loader'
import { Teacher } from '../../components/teachers/Teacher'
import { useTeachersState } from '../../store'

// TODO: Add loading skeleton
export const TeacherPage = () => {
  let { id } = useParams<{ id: string }>()
  const { fetchTeacher, teachersById, fetching, deleteTeacher } = useTeachersState()
  const teacher = teachersById[id]
  const onDelete = useCallback(() => deleteTeacher(id), [deleteTeacher, id])

  useEffect(() => {
    fetchTeacher(id)
  }, [fetchTeacher, id])

  // TODO: 404

  return (
    <>
      <Header />
      {/* TODO: skeleton loader */}
      <Loader show={fetching}>{teacher && <Teacher data={teacher} onDelete={onDelete} />}</Loader>
    </>
  )
}
