import React, { useCallback, useState } from 'react'
import { Link } from 'react-router-dom'
import { FabBtn } from 'components/kit/FabBtn/FabBtn'
import { PageLayout } from 'components/kit/layout/Page'
import { ROUTES } from '../../constants'
import { useOrgId } from '../../hooks/useOrgId'
import { Activity } from '../../types/activity'
import { Dictionary } from '../../types/dictionary'
import { Heading } from './groupList/ListHeader'
import { ActivitiesList } from './groupList/ActivitiesList'
import { FilteringDialog, FilteringFormValues } from './groupList/FilteringDialog'

interface Props {
  loading?: boolean
  items?: Activity[]
  attendanceRates?: Dictionary<number>
  onFiltersChange?: (data: FilteringFormValues) => void
  filter?: FilteringFormValues
}
export const GroupsList: React.FC<Props> = ({
  loading = false,
  items = [],
  attendanceRates,
  onFiltersChange,
  filter,
}) => {
  const [openFilterDialog, setOpenFilterDialog] = useState(false)
  const orgId = useOrgId()
  const onFiltersApply = useCallback(
    (data) => {
      onFiltersChange?.(data)
      setOpenFilterDialog(false)
    },
    [onFiltersChange]
  )

  return (
    <>
      <PageLayout>
        <Heading onFilterClick={() => setOpenFilterDialog(true)} />

        <ActivitiesList items={items} attendanceRates={attendanceRates} loading={loading} />
      </PageLayout>

      <Link to={`/${orgId}${ROUTES.GROUPS_ADD}`} data-testid="fab-btn">
        <FabBtn />
      </Link>

      <FilteringDialog
        open={openFilterDialog}
        onClose={() => setOpenFilterDialog(false)}
        onSave={onFiltersApply}
        filter={filter}
      />
    </>
  )
}
