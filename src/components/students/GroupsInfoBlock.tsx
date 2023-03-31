import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { Button, Preloader } from 'react-materialize'
import { FormattedMessage } from 'react-intl'
import { useParams } from 'react-router-dom'
import FilterAltIcon from '@mui/icons-material/FilterAlt'
import { Box } from '@mui/material'
import { useGroups, useParticipation } from 'store/groupsStore'
import { useAttendancesState } from 'store'
import { ActivitiesFilteringDialog, ActivitiesFilteringFormValues } from 'components/groups/ActivitiesFilteringDialog'
import { ResponsiveButtons } from 'components/kit/responsiveButtons/ResponsiveButtons'
import { useStudentAttendanceRateByGroups } from 'hooks/useAttendanceRate'
import { ROUTES } from '../../constants'
import { useOrgId } from '../../hooks/useOrgId'
import { Activity } from '../../types/activity'
import { Dictionary } from '../../types/dictionary'
import { Student } from '../../types/student'
import { AttendanceRateBadge } from '../kit/attendanceRateBadge/AttendancerateBadge'
import { IconButton } from '../kit/buttons/IconButton'
import { CollectionItemLink } from '../kit/collectionItemLink/CollectionItemLink'
import { Ellipsis } from '../kit/ellipsis/Ellipsis'
import { List } from '../kit/list/List'
import { Text } from '../kit/text/Text'
import { AssignGroups } from './AssignGroups'

interface Props {
  student: Student
}
export const GroupsInfoBlock = ({ student }: Props) => {
  const { groups, openFilterDialog, setOpenFilterDialog, loadingGroups, onFiltersApply, attendanceRates, filter } =
    useData(student?.outerId)
  const renderItem = useMemo(() => getGroupItemRender(attendanceRates, student), [attendanceRates, student])

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
              trigger={<IconButton type="square" size={40} icon="edit" />}
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

      <ActivitiesFilteringDialog
        open={openFilterDialog}
        onClose={() => setOpenFilterDialog(false)}
        onSave={onFiltersApply}
        filter={filter}
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
          <Button waves="light">
            <FormattedMessage id="students.groups.assignBtn.label" />
          </Button>
        }
      />
    </div>
  )
}

interface GroupWithAttendanceProps {
  group: Activity
  participant: Student
  attendanceRate?: number
}
const GroupWithAttendance = ({ group, attendanceRate, participant }: GroupWithAttendanceProps) => {
  const orgId = useOrgId()

  return (
    <CollectionItemLink to={`/${orgId}${ROUTES.makeStudentsByActivity(participant.id, group.id)}`}>
      <div
        className={`flex justify-between transition-opacity ${group.archived ? 'opacity-40 hover:opacity-100' : ''}`}
      >
        <Ellipsis>
          {group.archived ? <FormattedMessage id="groups.archived.name" values={{ name: group.name }} /> : group.name}
        </Ellipsis>
        {attendanceRate !== undefined && <AttendanceRateBadge value={attendanceRate} />}
      </div>
    </CollectionItemLink>
  )
}

function getGroupItemRender(attendances: Dictionary<number>, participant: Student) {
  return (data: Activity) => (
    <GroupWithAttendance key={data.id} group={data} attendanceRate={attendances[data.id]} participant={participant} />
  )
}

const emptyGroups: Activity[] = []

export function useData(studentOuterId?: string) {
  const orgKey = useOrgId()
  const date = useMemo(() => new Date(), [])
  let { id: idStr } = useParams<{ id: string }>()
  const id = parseInt(idStr)
  const [filter, setFilter] = useState<ActivitiesFilteringFormValues>(
    JSON.parse(localStorage.getItem('groupsFilter') || '{"showArchived": false}')
  )
  const onFiltersApply = useCallback((data) => {
    setFilter(data)
    setOpenFilterDialog(false)
    localStorage.setItem('groupsFilter', JSON.stringify(data))
  }, [])
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
  const [openFilterDialog, setOpenFilterDialog] = useState(false)

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
    openFilterDialog,
    setOpenFilterDialog,
    loadingGroups,
    onFiltersApply,
    attendanceRates,
    filter,
  }
}
