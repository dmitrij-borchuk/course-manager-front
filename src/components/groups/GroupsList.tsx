import React from 'react'
import { Link } from 'react-router-dom'
import { useActivitiesFiltering } from 'modules/activities/activitiesFilteringContext'
import { FabBtn } from 'components/kit/FabBtn/FabBtn'
import { ROUTES } from '../../constants'
import { useOrgId } from '../../hooks/useOrgId'
import { Activity } from '../../types/activity'
import { Dictionary } from '../../types/dictionary'
import { Heading } from './groupList/ListHeader'
import { ActivitiesList } from './groupList/ActivitiesList'

interface Props {
  loading?: boolean
  items?: Activity[]
  attendanceRates?: Dictionary<number>
}
export const GroupsList: React.FC<Props> = ({ loading = false, items = [], attendanceRates }) => {
  const orgId = useOrgId()
  const { setOpenFilterDialog } = useActivitiesFiltering()

  return (
    <>
      <Heading onFilterClick={() => setOpenFilterDialog(true)} />

      <ActivitiesList items={items} attendanceRates={attendanceRates} loading={loading} />

      <Link to={`/${orgId}${ROUTES.GROUPS_ADD}`} data-testid="fab-btn">
        <FabBtn />
      </Link>
    </>
  )
}
