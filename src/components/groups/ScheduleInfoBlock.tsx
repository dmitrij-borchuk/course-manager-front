import React from 'react'
import { FormattedMessage } from 'react-intl'
// import { Button } from 'react-materialize'
import { Link } from 'react-router-dom'
import { ROUTES } from '../../constants'
import { Activity } from '../../types/activity'
import { GroupFull } from '../../types/group'
import { OrganizationUser } from '../../types/user'
import { IconButton } from '../kit/buttons/IconButton'
import { Text } from '../kit/text/Text'
// import { WeekdaySelector } from '../kit/weekdaySelector/WeekdaySelector'

interface Props {
  group: any
}
export const ScheduleInfoBlock = ({ group }: Props) => {
  const { schedules } = group
  // We use only one schedule so far
  const schedule = schedules && schedules[0]

  return (
    <>
      <div className="flex justify-between items-center">
        <Text type="h5" color="primary">
          <FormattedMessage id="groups.schedule.title" />
        </Text>
        {/* Edit schedule btn */}
        {schedule && (
          <Link to={`${ROUTES.SCHEDULES_ROOT}?group=${group.id}`}>
            <IconButton type="square" size={40} icon="edit" />
          </Link>
        )}
      </div>

      {/* {schedule ? <ScheduleView value={schedule.cron} /> : <NoScheduleInfoBlock group={group} />} */}
    </>
  )
}

// interface NoScheduleInfoBlockProps {
//   group: Group
// }
// const NoScheduleInfoBlock = ({ group }: NoScheduleInfoBlockProps) => {
//   return (
//     <div className="text-center">
//       <Text type="h6" color="textGray" className="mb-3">
//         <FormattedMessage id="groups.schedule.empty" />
//       </Text>

//       {/* Define schedule */}
//       <Link to={`${ROUTES.SCHEDULES_ROOT}?group=${group.id}`}>
//         <Button waves="light">
//           <FormattedMessage id="groups.schedule.assignBtn.label" />
//         </Button>
//       </Link>
//     </div>
//   )
// }

// interface ScheduleViewProps {
//   value: string
// }
// const ScheduleView = ({ value }: ScheduleViewProps) => {
//   return <WeekdaySelector readonly value={value} />
// }
