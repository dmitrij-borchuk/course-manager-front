import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { FormattedDate } from 'react-intl'
import { noop } from '../../../utils/common'
import './style.css'

interface Props {
  onChange?: (cron: string) => void
  value?: string
  readonly?: boolean
}
export const WeekdaySelector = ({ onChange = noop, value = '0 12 * * *', readonly = false }: Props) => {
  const weekDaysArray = useWeekdays()
  const [selectedDays, setSelectedDates] = useState<number[]>(cronToWeekNumbers(value))

  const onClick = useCallback(
    (date: Date) => {
      const index = selectedDays.indexOf(date.getDay())
      if (index >= 0) {
        selectedDays.splice(index, 1)
        setSelectedDates(selectedDays)
      } else {
        selectedDays.push(date.getDay())
        setSelectedDates(selectedDays)
      }
      // TODO: validate it
      onChange(weekNumbersToCron(selectedDays))
    },
    [onChange, selectedDays]
  )

  useEffect(() => setSelectedDates(cronToWeekNumbers(value)), [value])

  return (
    <div className="flex justify-between">
      {/* Add full days on hover */}
      {weekDaysArray.map((date) => (
        <button
          key={date.getTime()}
          className={`h-10 w-10 flex justify-center items-center rounded-full bg-gray-200 border-none ${
            selectedDays.includes(date.getDay()) ? 'button-selected' : ''
          }`}
          onClick={(e) => {
            onClick(date)
            e.preventDefault()
          }}
          disabled={readonly}
        >
          <FormattedDate value={date} weekday="narrow" />
        </button>
      ))}
    </div>
  )
}

function useWeekdays() {
  return useMemo(() => {
    const today = new Date()
    const todayWeekday = today.getDay()
    const firstWeekday = new Date(today)
    firstWeekday.setDate(firstWeekday.getDate() - todayWeekday + 1)

    return [...Array.from(Array(7).keys())].map((day) => {
      const d = new Date(firstWeekday)
      d.setDate(firstWeekday.getDate() + day)
      return d
    })
  }, [])
}

function weekNumbersToCron(days: number[]) {
  return `0 12 * * ${days.join(',')}`
}

function cronToWeekNumbers(cron: string) {
  const parts = cron.split(' ')
  const weekPart = parts[parts.length - 1]
  if (weekPart === '*') {
    return []
  }
  return weekPart.split(',').map((s) => parseInt(s, 10))
}
