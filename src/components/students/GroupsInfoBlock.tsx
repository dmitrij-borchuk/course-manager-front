import { useEffect, useState } from 'react'
import { Preloader } from 'react-materialize'
import { FormattedMessage } from 'react-intl'
import { Link, useParams } from 'react-router-dom'
import { Button, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material'
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline'
import FilterAltIcon from '@mui/icons-material/FilterAlt'
import IconButton from '@mui/material/IconButton'
import AddIcon from '@mui/icons-material/Add'
import Tooltip from '@mui/material/Tooltip'
import Box from '@mui/material/Box'
import { useGroups, useParticipation } from 'store/groupsStore'
import { useAttendancesState } from 'store'
import { ActivityWithParticipation } from 'modules/activities/api'
import { useActivitiesFiltering } from 'modules/activities/activitiesFilteringContext'
import { UnassignDialog } from 'modules/activities/components/UnassignParticipantDialog'
import { ResponsiveButtons } from 'components/kit/responsiveButtons/ResponsiveButtons'
import { useStudentAttendanceRateByGroups } from 'hooks/useAttendanceRate'
import { ROUTES } from '../../constants'
import { useOrgId } from '../../hooks/useOrgId'
import { Dictionary } from '../../types/dictionary'
import { Student } from '../../types/student'
import { AttendanceRateBadge } from '../kit/attendanceRateBadge/AttendancerateBadge'
import { Text } from '../kit/text/Text'
import { AssignGroups } from './AssignGroups'

interface Props {
  student: Student
}
export const GroupsInfoBlock = ({ student }: Props) => {
  const { setOpenFilterDialog } = useActivitiesFiltering()
  const { groups, loadingGroups, attendanceRates, reload } = useData(student?.outerId)
  const [activityToUnassign, setActivityToUnassign] = useState<ActivityWithParticipation>()

  return (
    <>
      <div className="flex justify-between items-center">
        <Text type="h5" color="primary">
          <FormattedMessage id="groups.list.title" />
        </Text>

        <Box display="flex">
          <ResponsiveButtons
            items={[
              {
                id: 'filter',
                label: <FormattedMessage id="common.filter" />,
                icon: <FilterAltIcon />,
                onClick: () => setOpenFilterDialog(true),
              },
            ]}
          />

          {/* Assign groups dialog */}
          {!!groups?.length && (
            <AssignGroups
              student={student}
              initialGroups={groups}
              trigger={
                <Box ml={1}>
                  <IconButton>
                    <AddIcon />
                  </IconButton>
                </Box>
              }
              onDone={reload}
            />
          )}
        </Box>
      </div>

      {loadingGroups ? (
        <div className="flex justify-center">
          <Preloader color="red" flashing={false} size="medium" />
        </div>
      ) : groups?.length ? (
        <GroupsTable
          rows={groups}
          participant={student}
          attendances={attendanceRates}
          onRemoveClick={(d) => setActivityToUnassign(d)}
        />
      ) : (
        <NoGroupsInfoBlock student={student} />
      )}

      <UnassignDialog
        activity={activityToUnassign}
        participant={student}
        onDone={() => {
          setActivityToUnassign(undefined)
          reload()
        }}
        onCancel={() => setActivityToUnassign(undefined)}
      />
    </>
  )
}

interface NoGroupsInfoBlockProps {
  student: Student
}
const NoGroupsInfoBlock = ({ student }: NoGroupsInfoBlockProps) => {
  return (
    <div className="text-center">
      <Text type="h6" color="textGray" className="mb-3">
        <FormattedMessage id="students.groups.empty" />
      </Text>

      {/* Assign groups dialog */}
      <AssignGroups
        student={student}
        initialGroups={[]}
        trigger={
          <Button variant="contained">
            <FormattedMessage id="students.groups.assignBtn.label" />
          </Button>
        }
      />
    </div>
  )
}

const emptyGroups: ActivityWithParticipation[] = []

export function useData(studentOuterId?: string) {
  const orgKey = useOrgId()
  let { id: idStr } = useParams<{ id: string }>()
  const id = parseInt(idStr)
  const { filter } = useActivitiesFiltering()
  const query = useGroups({
    archived: filter.showArchived ? 'all' : 'false',
    participantId: id,
    // date,
  })
  // console.log('=-= 🚀 ~ useData ~ query:', query)
  const loadingGroups = query.isLoading
  const participationQuery = useParticipation({
    participantId: id,
  })
  const groups = query.data?.data || emptyGroups
  const { attendances, clearAttendances, fetchAttendances } = useAttendancesState()
  const attendanceRates = useStudentAttendanceRateByGroups(studentOuterId, groups, attendances)

  useEffect(() => {
    participationQuery.data?.data.forEach((p) => {
      fetchAttendances(orgKey, {
        activity: p.activity.outerId,
        from: new Date(p.startDate),
        to: p.endDate ? new Date(p.endDate) : undefined,
      })
    })
  }, [fetchAttendances, orgKey, participationQuery.data?.data])
  useEffect(() => {
    return () => {
      clearAttendances()
    }
  }, [clearAttendances])

  return {
    groups,
    loadingGroups,
    attendanceRates,
    reload: () => setDate(new Date()),
  }
}

type GroupsTableProps = {
  rows: ActivityWithParticipation[]
  participant: Student
  attendances: Dictionary<number>
  onRemoveClick?: (activity: ActivityWithParticipation) => void
}
function GroupsTable({ rows, participant, attendances, onRemoveClick }: GroupsTableProps) {
  return (
    <Table sx={{ minWidth: 650 }} aria-label="simple table">
      <TableHead>
        <TableRow>
          <TableCell>
            <FormattedMessage id="common.name.label" />
          </TableCell>
          <TableCell align="right" width="150px">
            <FormattedMessage id="students.groups.tableHeader.start" />
          </TableCell>
          <TableCell align="right" width="150px">
            <FormattedMessage id="students.groups.tableHeader.status" />
          </TableCell>
          <TableCell align="right" width="150px">
            <FormattedMessage id="attendance.listItem.header.title" />
          </TableCell>
          <TableCell align="right" width={5}></TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {rows.map((row) => (
          <GroupsTableRow
            key={row.id}
            data={row}
            attendances={attendances}
            participant={participant}
            rate={attendances[row.id]}
            onClick={onRemoveClick}
          />
        ))}
      </TableBody>
    </Table>
  )
}

type GroupsTableRowProps = {
  data: ActivityWithParticipation
  participant: Student
  attendances: Dictionary<number>
  rate: number
  onClick?: (activity: ActivityWithParticipation) => void
}
function GroupsTableRow({ data, participant, rate, onClick }: GroupsTableRowProps) {
  const orgId = useOrgId()
  const lastParticipation = data.studentsToActivities
    .sort((a, b) => {
      if (a.startDate > b.startDate) {
        return -1
      }
      if (a.startDate < b.startDate) {
        return 1
      }
      return 0
    })
    .find((s) => s.participantId === participant.id)
  const activeParticipation = lastParticipation?.endDate === null
  const { archived } = data

  return (
    <TableRow key={data.name} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
      <TableCell component="th" scope="row">
        <Link to={`/${orgId}${ROUTES.makeStudentsByActivity(participant.id, data.id)}`}>{data.name}</Link>
      </TableCell>
      <TableCell align="right">
        {lastParticipation && new Date(lastParticipation?.startDate).toLocaleDateString()}
      </TableCell>
      <TableCell align="right" sx={{ whiteSpace: 'nowrap' }}>
        {archived ? (
          <FormattedMessage id="students.groups.archived" />
        ) : activeParticipation ? (
          <FormattedMessage id="students.groups.activeParticipation" />
        ) : (
          lastParticipation?.endDate && (
            <FormattedMessage
              id="students.groups.left"
              values={{ date: new Date(lastParticipation?.endDate).toLocaleDateString() }}
            />
          )
        )}
      </TableCell>
      <TableCell align="right">{rate !== undefined && <AttendanceRateBadge value={rate} />}</TableCell>
      <TableCell align="right">
        <Tooltip title={<FormattedMessage id="groups.unassignStudents.tooltip" />} placement="top">
          <IconButton
            onClick={(e) => {
              e.stopPropagation()
              e.preventDefault()
              onClick?.(data)
            }}
          >
            <RemoveCircleOutlineIcon />
          </IconButton>
        </Tooltip>
      </TableCell>
    </TableRow>
  )
}
