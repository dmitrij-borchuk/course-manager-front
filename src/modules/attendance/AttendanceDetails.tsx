import { useCallback, useMemo, useRef, useState } from 'react'
import { ResponsiveCalendar, ViewType } from 'react-responsive-calendar'
import { Backdrop, Box, Button, CircularProgress, Divider, Stack, Typography } from '@mui/material'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import CancelIcon from '@mui/icons-material/Cancel'
import { useQuery } from 'react-query'
import { FormattedDate, FormattedMessage } from 'react-intl'
import { Ellipsis } from 'components/kit/ellipsis/Ellipsis'
import { Text } from 'components/kit/text/Text'
import { Activity } from 'types/activity'
import { Attendance } from 'types/attendance'
import { Dictionary } from 'types/dictionary'
import { fetchAttendances } from 'modules/attendance/api'
import { useOrgId } from 'hooks/useOrgId'
import { useParticipation } from 'store/groupsStore'
import { ParticipationRecord } from 'modules/activities/api'
import { getAttendanceStatisticOfParticipant } from 'services/attendances'
import { Student } from 'types/student'
import { isWeekend } from 'utils/date'
import { ArrowBackIosNew, ArrowForwardIos } from '@mui/icons-material'

type Props = {
  participant: Student
}
export function AttendanceDetails({ participant }: Props) {
  const [date, setDate] = useState(new Date())
  const participantOuterId = participant.outerId
  const incrementFn = useRef(getIncrementFunction(ViewType.DESKTOP))
  const [viewType, setViewType] = useState(ViewType.DESKTOP)
  const isCurrentYear = useMemo(() => date.getFullYear() === new Date().getFullYear(), [date])
  const viewChangeHandler = useCallback((view) => {
    setViewType(view)
    incrementFn.current = getIncrementFunction(view)
  }, [])
  const orgKey = useOrgId()
  const participationQuery = useParticipation({
    participantId: participant.id,
  })
  const { data: participationResp } = participationQuery
  const attendanceQuery = useAttendanceQuery(orgKey, participationResp?.data)
  const attendancesByDate = useAttendancesByDate(attendanceQuery.data)

  const renderCell = useCallback(
    ({ date, isMobile }: { date: Date; isMobile: boolean }) => {
      return (
        <CalendarCell
          attendancesByDate={attendancesByDate}
          date={date}
          isMobile={isMobile}
          participantOuterId={participantOuterId}
        />
      )
    },
    [attendancesByDate, participantOuterId]
  )
  const renderWeekDay = useCallback(({ date }: { date: Date }) => {
    return (
      <Typography variant="h6">
        <FormattedDate value={date} weekday="short" />
      </Typography>
    )
  }, [])

  return (
    <Box>
      {/* TODO: add swipes */}
      <div className="flex justify-between">
        <Button variant="text" onClick={() => setDate(incrementFn.current(-1, date))} startIcon={<ArrowBackIosNew />}>
          <FormattedMessage id="calendar.previousBtn.label" />
        </Button>
        {viewType === ViewType.DESKTOP && (
          <Box display="flex" justifyContent="center" mb={3}>
            <Typography variant="h4">
              <FormattedDate value={date} month="long" />{' '}
              {!isCurrentYear && <FormattedDate value={date} year="numeric" />}
            </Typography>
          </Box>
        )}
        <Button variant="text" onClick={() => setDate(incrementFn.current(1, date))} endIcon={<ArrowForwardIos />}>
          <FormattedMessage id="calendar.nextBtn.label" />
        </Button>
      </div>

      <ResponsiveCalendar
        date={date}
        withWeekDays
        renderWeekDay={renderWeekDay}
        onViewChanged={viewChangeHandler}
        renderCell={renderCell}
        breakPoint={0}
      />
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={attendanceQuery.isLoading || participationQuery.isLoading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </Box>
  )
}

type CalendarCellProps = {
  date: Date
  isMobile: boolean
  attendancesByDate: Map<string, Attendance[]>
  participantOuterId: string
}
function CalendarCell({ date, isMobile, attendancesByDate, participantOuterId }: CalendarCellProps) {
  const currentAttendances = attendancesByDate.get(getDateKey(date))
  const attendanceRate = getAttendanceStatisticOfParticipant(participantOuterId, currentAttendances || [])
  const hasClasses = currentAttendances && currentAttendances.length > 0
  const attended = attendanceRate?.rate === 1
  const weekend = isWeekend(date)
  const isCurrentYear = useMemo(() => date.getFullYear() === new Date().getFullYear(), [date])

  return (
    <Box>
      <Stack
        direction={{
          xs: 'column',
          sm: 'row',
        }}
        alignItems="center"
        height={{
          xs: '75px',
          sm: '100px',
        }}
      >
        <div className="flex flex-col items-center w-12">
          <Typography variant="subtitle2">
            {isMobile && !isCurrentYear && <FormattedDate value={date} year="numeric" />}
          </Typography>
          {isMobile && (
            <Text type="body" className="m-0 whitespace-nowrap">
              <FormattedDate value={date} month="short" />
            </Text>
          )}
          <Typography variant="h4" color={weekend ? 'error' : 'primary'} className="m-0">
            {date.getDate()}
          </Typography>
          {isMobile && (
            <Text type="body" className="m-0">
              <FormattedDate value={date} weekday="short" />
            </Text>
          )}
        </div>

        {hasClasses && <AttendanceIndicator attended={attended} />}
      </Stack>
      <Divider light />
    </Box>
  )
}

function useAttendanceQuery(orgKey: string, participationList?: ParticipationRecord[]) {
  return useQuery(
    ['attendances', orgKey, participationList],
    async () => {
      if (!participationList) {
        return []
      }

      return getAttendancesForGroupsAndDates(orgKey, participationList)
    },
    {
      refetchOnWindowFocus: false,
    }
  )
}

const emptyList: Attendance[] = []
function useAttendancesByDate(list: Attendance[] | undefined = emptyList) {
  return useMemo(() => {
    return list.reduce<Map<string, Attendance[]>>((acc, attendance) => {
      const dateKey = getDateKey(new Date(attendance.date))
      const array = acc.get(dateKey)
      if (array) {
        array.push(attendance)
      } else {
        acc.set(dateKey, [attendance])
      }
      return acc
    }, new Map())
  }, [list])
}

function AttendanceIndicator({ attended }: { attended: boolean }) {
  return <AttendanceIcon attended={attended} />
}

function AttendanceIcon({ attended }: { attended: boolean }) {
  if (attended) {
    return <CheckCircleIcon fontSize="large" color="success" />
  }

  return <CancelIcon fontSize="large" color="error" />
}
function getDateKey(date: Date) {
  return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`
}
async function getAttendancesForGroupsAndDates(orgKey: string, participationList: ParticipationRecord[]) {
  const resp = await Promise.all(
    participationList.map((p) =>
      fetchAttendances(orgKey, {
        activity: p.activity.outerId,
        from: new Date(p.startDate),
        to: p.endDate ? new Date(p.endDate) : undefined,
      })
    )
  )

  return resp.flat()
}
function getIncrementFunction(view: ViewType) {
  if (view === ViewType.MOBILE) {
    return addWeeks
  }
  return addMonths
}
function addMonths(n: number, date: Date) {
  const newDate = new Date(date)
  newDate.setMonth(newDate.getMonth() + n)
  return newDate
}

function addWeeks(n: number, date: Date) {
  const newDate = new Date(date)
  newDate.setDate(newDate.getDate() + n * 7)
  return newDate
}

type Props2 = {
  attendances: GroupedAttendances[]
  studentOuterId: string
  allGroupsById: Dictionary<Activity>
}
// TODO: unused so far
export function AttendanceDetailsTimeline({ attendances, studentOuterId, allGroupsById }: Props2) {
  return (
    <div>
      <Typography variant="h4">
        <FormattedMessage id="students.attendance.details.label" />
      </Typography>
      {attendances.map((byYear) => (
        <div key={byYear.year}>
          <Text size="25" color="primary" className="m-0">
            {byYear.year}
          </Text>
          {byYear.data.map((byMonth) => {
            const date = new Date()
            date.setMonth(byMonth.month)
            return (
              <div key={byMonth.month}>
                <Text type="body" className="m-0">
                  <FormattedDate value={date} month="short" />
                </Text>
                {byMonth.data.map((a) => {
                  const attended = a.attended[studentOuterId] === true
                  const groupName = allGroupsById[a.group]?.name
                  return (
                    <div
                      className={`flex w-full justify-between pl-4 pr-4 items-center ${
                        attended ? 'bg-green-200' : 'bg-red-200'
                      }`}
                    >
                      <div className="flex items-center">
                        <div className="flex flex-col items-center my-1 gap-1">
                          <Text size="25" color="primary" className="m-0">
                            {new Date(a.date).getDate()}
                          </Text>
                          <Text type="body" className="m-0">
                            <FormattedDate value={a.date} weekday="short" />
                          </Text>
                        </div>
                        <Ellipsis className="z-10 ml-4">
                          <Text size="16" className="overflow-ellipsis overflow-hidden">
                            {groupName}
                          </Text>
                        </Ellipsis>
                      </div>
                      <Text type="body" className="ml-4">
                        <FormattedMessage id={`students.attendance.${attended ? 'attended' : 'missed'}`} />
                      </Text>
                    </div>
                  )
                })}
              </div>
            )
          })}
        </div>
      ))}
    </div>
  )
}

type GroupedAttendances = {
  year: number
  data: {
    month: number
    data: Attendance[]
  }[]
}
