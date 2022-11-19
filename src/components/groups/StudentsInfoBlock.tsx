import { useCallback, useMemo, useState } from 'react'
import { FormattedMessage } from 'react-intl'
import { Button, Dropdown, Preloader } from 'react-materialize'
import { Link } from 'react-router-dom'
import { ROUTES } from '../../constants'
import { useCurrentOrg } from '../../hooks/useCurrentOrg'
import { useNotification } from '../../hooks/useNotification'
import { useOrgId } from '../../hooks/useOrgId'
import { useStudentsOfGroupState } from '../../store'
import { Dictionary } from '../../types/dictionary'
import { Group } from '../../types/group'
import { Student } from '../../types/student'
import { noop } from '../../utils/common'
import { AttendanceRateBadge } from '../kit/attendanceRateBadge/AttendancerateBadge'
import { IconButton } from '../kit/buttons/IconButton'
import { Ellipsis } from '../kit/ellipsis/Ellipsis'
import { List } from '../kit/list/List'
import { Text } from '../kit/text/Text'
import { TinyPreloader } from '../kit/TinyPreloader/TinyPreloader'
import { AssignStudents } from './AssignStudents'

interface StudentsInfoBlockProps {
  students?: Student[]
  group: Group
  attendanceRates: Dictionary<number>
  loadingGroups?: boolean
}
export const StudentsInfoBlock = ({
  students,
  group,
  attendanceRates,
  loadingGroups = false,
}: StudentsInfoBlockProps) => {
  const { showSuccess } = useNotification()
  const orgKey = useOrgId()
  const org = useCurrentOrg()
  const orgId = org?.id
  const { deleteStudentFromGroup } = useStudentsOfGroupState()
  const [loading, setLoading] = useState<Dictionary<boolean>>({})
  const { fetchStudentsOfGroup } = useStudentsOfGroupState()
  const refetchStudents = useCallback(async () => {
    if (orgId) {
      fetchStudentsOfGroup(orgId, orgKey, group.id, new Date())
    }
  }, [fetchStudentsOfGroup, group.id, orgId, orgKey])
  const onStudentRemove = useCallback(
    async (id: string) => {
      setLoading((l) => {
        l[id] = true
        return l
      })
      try {
        await deleteStudentFromGroup(orgKey, id, group.id)
        refetchStudents()
        showSuccess(<FormattedMessage id="groups.unassignStudents.success" />)
      } catch (error) {
        if (error instanceof Error) {
          showSuccess(<FormattedMessage id="groups.unassignStudents.error" values={{ message: error.message }} />)
        } else {
          throw error
        }
      } finally {
        setLoading((l) => {
          l[id] = false
          return l
        })
      }
    },
    [deleteStudentFromGroup, group.id, orgKey, refetchStudents, showSuccess]
  )
  const renderItem = useMemo(
    () => getStudentItemRender(attendanceRates, loading, onStudentRemove),
    [attendanceRates, loading, onStudentRemove]
  )

  return (
    <div data-testid="students-list">
      <div className="flex justify-between items-center">
        <Text type="h5" color="primary">
          <FormattedMessage id="students.list.title" />
        </Text>
        {/* Assign groups dialog */}
        {!!students?.length && (
          <AssignStudents
            group={group}
            trigger={<IconButton type="square" size={40} icon="edit" />}
            studentsOfGroup={students}
            onDone={refetchStudents}
          />
        )}
      </div>

      {loadingGroups ? (
        <div className="flex justify-center">
          <Preloader color="red" flashing={false} size="medium" />
        </div>
      ) : students?.length ? (
        <List items={students} renderItem={renderItem} className="overflow-visible" />
      ) : (
        <NoStudentsInfoBlock group={group} />
      )}
    </div>
  )
}

interface NoStudentsInfoBlockProps {
  group: Group
  students?: Student[]
}
const NoStudentsInfoBlock = ({ group, students }: NoStudentsInfoBlockProps) => {
  const orgKey = useOrgId()
  const org = useCurrentOrg()
  const orgId = org?.id
  const { fetchStudentsOfGroup } = useStudentsOfGroupState()
  const refetchStudents = useCallback(async () => {
    if (orgId) {
      fetchStudentsOfGroup(orgId, orgKey, group.id, new Date())
    }
  }, [fetchStudentsOfGroup, group.id, orgId, orgKey])

  return (
    <div className="text-center">
      <Text type="h6" color="textGray" className="mb-3">
        <FormattedMessage id="groups.students.empty" />
      </Text>

      {/* Assign students dialog */}
      <AssignStudents
        group={group}
        trigger={
          <Button waves="light">
            <FormattedMessage id="groups.students.assignBtn.label" />
          </Button>
        }
        studentsOfGroup={students}
        onDone={refetchStudents}
      />
    </div>
  )
}

interface StudentWithAttendanceProps {
  data: Student
  attendanceRate?: number
  onRemoveClick?: (id: string) => void
  loading?: boolean
}
const StudentWithAttendance = ({
  data,
  attendanceRate,
  onRemoveClick = noop,
  loading = false,
}: StudentWithAttendanceProps) => {
  const orgId = useOrgId()

  return (
    <div className="collection-item flex justify-between items-center" data-testid={`student-${data.id}`}>
      <div className="flex">
        {loading && <TinyPreloader />}
        <Ellipsis>
          <Link to={`/${orgId}${ROUTES.STUDENTS_ROOT}/${data.id}`}>{data.name}</Link>
        </Ellipsis>
      </div>
      <div className="flex">
        {/* TODO: add loading */}
        {attendanceRate !== undefined && <AttendanceRateBadge value={attendanceRate} />}
        {/* <Icon right>more_horiz</Icon> */}

        <Dropdown
          options={{
            alignment: 'right',
            autoTrigger: true,
            closeOnClick: true,
            constrainWidth: false,
            container: null,
            coverTrigger: true,
            hover: false,
            inDuration: 150,
            outDuration: 250,
          }}
          className="w-52"
          trigger={
            <IconButton
              type="round"
              size={40}
              icon="more_horiz"
              className="collection-menu-btn flex items-center justify-center"
            />
          }
        >
          {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
          <a href="#" className="whitespace-nowrap w-52" onClick={() => onRemoveClick(data.outerId)}>
            <FormattedMessage id="groups.studentList.removeBtn" />
          </a>
        </Dropdown>
      </div>
    </div>
  )
}

function getStudentItemRender(
  attendances: Dictionary<number>,
  loading: Dictionary<boolean> = {},
  onRemoveClick?: (id: string) => void
) {
  return (data: Student) => (
    <StudentWithAttendance
      key={data.id}
      data={data}
      attendanceRate={attendances[data.outerId]}
      loading={loading[data.outerId]}
      onRemoveClick={onRemoveClick}
    />
  )
}
