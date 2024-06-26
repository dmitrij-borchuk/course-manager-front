import { useCallback, useMemo, useState } from 'react'
import { FormattedMessage } from 'react-intl'
import { Button } from 'react-materialize'
import { Link } from 'react-router-dom'
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline'
import { CircularProgress, Typography } from '@mui/material'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import AddIcon from '@mui/icons-material/Add'
import Box from '@mui/material/Box'
import { UnassignDialog } from 'modules/activities/components/UnassignParticipantDialog'
import { ROUTES } from '../../constants'
import { useStudentsOfGroupState } from '../../store'
import { Activity } from '../../types/activity'
import { Dictionary } from '../../types/dictionary'
import { Student } from '../../types/student'
import { noop } from '../../utils/common'
import { AttendanceRateBadge } from '../kit/attendanceRateBadge/AttendancerateBadge'
import { Ellipsis } from '../kit/ellipsis/Ellipsis'
import { List } from '../kit/list/List'
import { Text } from '../kit/text/Text'
import { AssignStudents } from './AssignStudents'

interface StudentsInfoBlockProps {
  students?: Student[]
  group: Activity
  attendanceRates: Dictionary<{ rate: number }>
  loadingGroups?: boolean
}
export const StudentsInfoBlock = ({
  students,
  group,
  attendanceRates,
  loadingGroups = false,
}: StudentsInfoBlockProps) => {
  const { fetchStudentsOfGroup } = useStudentsOfGroupState()
  const refetchStudents = useCallback(async () => {
    fetchStudentsOfGroup(group.id, new Date())
  }, [fetchStudentsOfGroup, group.id])
  const [participantToRemove, setParticipantToRemove] = useState<Student>()
  const onStudentRemoveInitiate = useCallback(
    (id: number) => {
      setParticipantToRemove(students?.find((s) => s.id === id))
    },
    [students]
  )
  const onStudentRemoved = useCallback(async () => {
    setParticipantToRemove(undefined)
    refetchStudents()
  }, [refetchStudents])
  const renderItem = useMemo(
    () => getStudentItemRender(attendanceRates, onStudentRemoveInitiate),
    [attendanceRates, onStudentRemoveInitiate]
  )

  return (
    <div data-testid="students-list">
      <div className="flex justify-between items-center">
        <Typography variant="h5">
          <FormattedMessage id="students.list.title" />
        </Typography>
        {/* Assign groups dialog */}
        {!!students?.length && (
          <AssignStudents
            group={group}
            trigger={
              <Box ml={1}>
                <IconButton>
                  <AddIcon />
                </IconButton>
              </Box>
            }
            onDone={refetchStudents}
          />
        )}
      </div>

      {loadingGroups ? (
        <div className="flex justify-center">
          <CircularProgress />
        </div>
      ) : students?.length ? (
        <List items={students} renderItem={renderItem} className="overflow-visible" />
      ) : (
        <NoStudentsInfoBlock group={group} />
      )}

      <UnassignDialog
        activity={group}
        participant={participantToRemove}
        onCancel={() => setParticipantToRemove(undefined)}
        onDone={() => {
          onStudentRemoved()
        }}
      />
    </div>
  )
}

interface NoStudentsInfoBlockProps {
  group: Activity
}
const NoStudentsInfoBlock = ({ group }: NoStudentsInfoBlockProps) => {
  const { fetchStudentsOfGroup } = useStudentsOfGroupState()
  const refetchStudents = useCallback(async () => {
    fetchStudentsOfGroup(group.id, new Date())
  }, [fetchStudentsOfGroup, group.id])

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
        onDone={refetchStudents}
      />
    </div>
  )
}

interface StudentWithAttendanceProps {
  data: Student
  attendanceRate?: number
  onRemoveClick?: (id: number) => void
}
const StudentWithAttendance = ({ data, attendanceRate, onRemoveClick = noop }: StudentWithAttendanceProps) => {
  return (
    <div className="collection-item flex justify-between items-center" data-testid={`student-${data.id}`}>
      <div className="flex">
        <Ellipsis>
          <Link to={`${ROUTES.STUDENTS_ROOT}/${data.id}`}>{data.name}</Link>
        </Ellipsis>
      </div>
      <Box display="flex" alignItems="center" gap={2}>
        {/* TODO: add loading */}
        {attendanceRate !== undefined && <AttendanceRateBadge value={attendanceRate} />}

        <Tooltip title={<FormattedMessage id="groups.studentList.removeBtn" />} placement="top">
          <IconButton
            onClick={(e) => {
              e.stopPropagation()
              e.preventDefault()
              onRemoveClick(data.id)
            }}
          >
            <RemoveCircleOutlineIcon />
          </IconButton>
        </Tooltip>
      </Box>
    </div>
  )
}

function getStudentItemRender(attendances: Dictionary<{ rate: number }>, onRemoveClick?: (id: number) => void) {
  return (data: Student) => (
    <StudentWithAttendance
      key={data.id}
      data={data}
      attendanceRate={attendances?.[data.outerId]?.rate}
      onRemoveClick={onRemoveClick}
    />
  )
}
