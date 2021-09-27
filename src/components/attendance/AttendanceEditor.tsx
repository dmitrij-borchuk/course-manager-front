import React, { useCallback } from 'react'
import { FormattedDate } from 'react-intl'
import { Container } from 'react-materialize'
// import { useDictionary } from '../../hooks/useDictionary'
import { AttendanceFull } from '../../types/attendance'
import { Group } from '../../types/group'
import { Student } from '../../types/student'
// import { noop } from '../../utils/common'
// import { datesAreOnSameDay } from '../../utils/date'
import { SubmitButton } from '../kit/buttons/SubmitButton'
// import { Ellipsis } from '../kit/ellipsis/Ellipsis'
// import { List } from '../kit/list/List'
import { SectionHeader } from '../kit/sectionHeader/SectionHeader'

interface Props {
  className?: string
  group: Group
  date: Date
  onSubmit?: (data: { toAdd: Student[]; toRemove: Student[] }) => void
  attendances: AttendanceFull[]
}
export const AttendanceEditor = (props: Props) => {
  const { className, group, date /* , onSubmit = noop, attendances */ } = props
  // const attendancesByStudent = useMemo(() => {
  //   return attendances.reduce<Record<string, AttendanceFull[]>>((acc, a) => {
  //     if (!a.student?.id) {
  //       return acc
  //     }

  //     acc[a.student.id] = acc[a.student.id] || []
  //     acc[a.student.id].push(a)

  //     return acc
  //   }, {})
  // }, [attendances])
  // const initialSelected = useMemo(() => {
  //   const map: Record<string, boolean> = {}
  //   // TODO: implement me
  //   // group.students?.forEach((s) => {
  //   //   const studentsAttendance = attendancesByStudent[s.id] || []
  //   //   const thisDayAttendance = studentsAttendance.filter((a) => datesAreOnSameDay(new Date(a.date), date))
  //   //   const hasAttendance = !!thisDayAttendance.find((a) => a.student?.id === s.id)
  //   //   map[s.id] = hasAttendance
  //   // })

  //   return map
  // }, [])
  // const [selected, setSelected] = useState<Record<string, boolean>>(initialSelected)
  // const renderItem = useMemo(
  //   () => (s: Student) =>
  //     (
  //       <div
  //         className="collection-item flex justify-between items-center cursor-pointer"
  //         onClick={() => setSelected((selected) => ({ ...selected, [s.id]: !selected[s.id] }))}
  //       >
  //         <Ellipsis className="color-secondary">{s.name}</Ellipsis>
  //         {selected[s.id] && (
  //           <div className="-my-3 -mr-5 flex color-secondary">
  //             <Icon center className="text-5xl">
  //               check_circle
  //             </Icon>
  //           </div>
  //         )}
  //         {!selected[s.id] && (
  //           <div className="-my-3 -mr-5 flex color-text-gray">
  //             <Icon center className="text-5xl">
  //               radio_button_unchecked
  //             </Icon>
  //           </div>
  //         )}
  //       </div>
  //     ),
  //   [selected]
  // )
  // const studentsById = useDictionary(group.students)
  // const { students } = group
  const submitHandler = useCallback(() => {
    // TODO: implement me
    // const initialSelectedArray = Object.entries(initialSelected)
    //   .filter(([key, value]) => value)
    //   .map(([key]) => key)
    // const selectedArray = Object.entries(selected)
    //   .filter(([key, value]) => value)
    //   .map(([key]) => key)
    // const toAdd: Student[] = []
    // const toRemove: Student[] = []
    // selectedArray.forEach((id) => {
    //   if (!initialSelectedArray.includes(id)) {
    //     toAdd.push(studentsById[id])
    //   }
    // })
    // initialSelectedArray.forEach((id) => {
    //   if (!selectedArray.includes(id)) {
    //     toRemove.push(studentsById[id])
    //   }
    // })
    // onSubmit({
    //   toAdd,
    //   toRemove,
    // })
  }, [])

  return (
    <div className={className}>
      <Container className="px-4">
        <SectionHeader>{group.name}</SectionHeader>
        <div>
          <FormattedDate month="short" day="2-digit" weekday="short" value={date} />
        </div>
        {/* {students?.length ? <List items={students} renderItem={renderItem} /> : <NoStudents />} */}
        <div className="flex justify-end">
          <SubmitButton onSubmit={submitHandler} />
        </div>
      </Container>
    </div>
  )
}

export default AttendanceEditor

// TODO: add implementation
// const NoStudents = () => <div />
