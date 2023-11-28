import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { Preloader } from 'react-materialize'
import { FormattedMessage } from 'react-intl'
import { useParams } from 'react-router-dom'
import FilterAltIcon from '@mui/icons-material/FilterAlt'
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline'
import AddIcon from '@mui/icons-material/Add'
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import { useGroups, useParticipation } from 'store/groupsStore'
import { useAttendancesState } from 'store'
import { useActivitiesFiltering } from 'modules/activities/activitiesFilteringContext'
import { ResponsiveButtons } from 'components/kit/responsiveButtons/ResponsiveButtons'
import { useStudentAttendanceRateByGroups } from 'hooks/useAttendanceRate'
import { ROUTES } from '../../constants'
import { useOrgId } from '../../hooks/useOrgId'
import { Activity } from '../../types/activity'
import { Dictionary } from '../../types/dictionary'
import { Student } from '../../types/student'
import { AttendanceRateBadge } from '../kit/attendanceRateBadge/AttendancerateBadge'
import { CollectionItemLink } from '../kit/collectionItemLink/CollectionItemLink'
import { Ellipsis } from '../kit/ellipsis/Ellipsis'
import { List } from '../kit/list/List'
import { Text } from '../kit/text/Text'
import { AssignGroups } from './AssignGroups'
import Tooltip from '@mui/material/Tooltip'
import { Button } from '@mui/material'
import { UnassignDialog } from 'modules/activities/components/UnassignParticipantDialog'

interface Props {
  student: Student
}
export const GroupsInfoBlock = ({ student }: Props) => {
  const { setOpenFilterDialog } = useActivitiesFiltering()
  const { groups, loadingGroups, attendanceRates, reload } = useData(student?.outerId)
  const renderItem = useMemo(() => getGroupItemRender(attendanceRates, student), [attendanceRates, student])
  const [activityToUnassign, setActivityToUnassign] = useState<Activity>()
  const initiateUnassign = (activity: number) => {
    setActivityToUnassign(groups.find((g) => g.id === activity))
  }

  return (
    <>
      <AssigningContext.Provider
        value={{
          initiateUnassign,
        }}
      >
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
          <List items={groups} renderItem={renderItem} />
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
      </AssigningContext.Provider>
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

interface GroupWithAttendanceProps {
  activity: Activity
  participant: Student
  attendanceRate?: number
  onRemoveClick?: (activity: Activity) => void
}
const GroupWithAttendance = ({ activity, attendanceRate, participant }: GroupWithAttendanceProps) => {
  const orgId = useOrgId()
  const { initiateUnassign } = useAssigningContext()

  return (
    <>
      <CollectionItemLink to={`/${orgId}${ROUTES.makeStudentsByActivity(participant.id, activity.id)}`}>
        <div
          className={`flex justify-between transition-opacity items-center ${
            activity.archived ? 'opacity-40 hover:opacity-100' : ''
          }`}
        >
          <Ellipsis>
            {activity.archived ? (
              <FormattedMessage id="groups.archived.name" values={{ name: activity.name }} />
            ) : (
              activity.name
            )}
          </Ellipsis>
          <Box display="flex" alignItems="center" gap={2} ml={2}>
            {attendanceRate !== undefined && <AttendanceRateBadge value={attendanceRate} />}
            <Tooltip title={<FormattedMessage id="groups.unassignStudents.tooltip" />} placement="top">
              <IconButton
                onClick={(e) => {
                  e.stopPropagation()
                  e.preventDefault()
                  initiateUnassign(activity.id)
                }}
              >
                <RemoveCircleOutlineIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </div>
      </CollectionItemLink>
    </>
  )
}

function getGroupItemRender(
  attendances: Dictionary<number>,
  participant: Student,
  onRemoveClick?: (activity: Activity) => void
) {
  return (data: Activity) => (
    <GroupWithAttendance
      key={data.id}
      activity={data}
      attendanceRate={attendances[data.id]}
      participant={participant}
      onRemoveClick={onRemoveClick}
    />
  )
}

const emptyGroups: Activity[] = []

export function useData(studentOuterId?: string) {
  const orgKey = useOrgId()
  const [date, setDate] = useState(new Date())
  let { id: idStr } = useParams<{ id: string }>()
  const id = parseInt(idStr)
  const { filter } = useActivitiesFiltering()
  const query = useGroups({
    archived: filter.showArchived ? 'all' : 'false',
    participantId: id,
    date,
  })
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

const AssigningContext = createContext({
  initiateUnassign: (activity: number) => {},
})
const useAssigningContext = () => useContext(AssigningContext)
