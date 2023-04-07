import React, { useCallback, useMemo, useState } from 'react'
import { ActivitiesFilteringDialog } from './components/ActivitiesFilteringDialog'

const defaultFilter = {
  showArchived: false,
}

export const ActivitiesFilteringContext = React.createContext<ActivitiesFilteringContextValue>({
  filter: defaultFilter,
  updateFilter: () => {},
  setOpenFilterDialog: () => {},
})

export function useActivitiesFiltering() {
  return React.useContext(ActivitiesFilteringContext)
}

export function ActivitiesFilteringProvider({ children }: { children: React.ReactNode }) {
  const [filter, setFilter] = useState<Filter>(
    JSON.parse(localStorage.getItem('groupsFilter') || JSON.stringify(defaultFilter))
  )
  const [openFilterDialog, setOpenFilterDialog] = useState(false)
  const saveFilter = useCallback((data: Filter) => {
    setFilter(data)
    setOpenFilterDialog(false)
    localStorage.setItem('groupsFilter', JSON.stringify(data))
  }, [])
  const value = useMemo(
    () => ({
      filter,
      updateFilter: saveFilter,
      setOpenFilterDialog,
    }),
    [filter, saveFilter]
  )

  return (
    <>
      <ActivitiesFilteringContext.Provider value={value}>{children}</ActivitiesFilteringContext.Provider>

      <ActivitiesFilteringDialog
        open={openFilterDialog}
        onClose={() => setOpenFilterDialog(false)}
        onSave={saveFilter}
        filter={filter}
      />
    </>
  )
}

type ActivitiesFilteringContextValue = {
  filter: Filter
  updateFilter: (data: Filter) => void
  setOpenFilterDialog: React.Dispatch<React.SetStateAction<boolean>>
}

type Filter = {
  showArchived: boolean
}
