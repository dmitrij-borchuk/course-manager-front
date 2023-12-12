import { ComponentProps, useCallback, useState } from 'react'
import { FormattedMessage, useIntl } from 'react-intl'
import { DatePicker } from 'react-materialize'
import { useQuery } from 'react-query'
import Grid from '@mui/material/Unstable_Grid2'
import Box from '@mui/material/Box'
import { getReportByTagRequest } from 'modules/reports/api'
import { SortByField } from 'components/kit/SortByField'
import { TagsEditor } from '../../components/kit/tag/TagsEditor'
import { Text } from '../../components/kit/text/Text'
import { ReportByTag } from '../../components/reports/ReportByTag'
import { usePersistenceState } from '../../hooks/usePersistenceState'
import { SortOrder } from '../../types/sorting'

export const ReportByTagTab = () => {
  const intl = useIntl()
  const [to, setTo] = useState(new Date())
  const [from, setFrom] = useState(subMonth(to))
  const [order, setOrder] = usePersistenceState<SortOrder>(orderStoreKey, 'asc')
  const [orderBy, setOrderBy] = usePersistenceState<string>(orderByStoreKey, 'participantName')
  const [tags, setTags] = useState<string[]>([])
  const onTagsUpdate = useCallback(
    (newTags: string[]) => {
      setTags(newTags)
    },
    [setTags]
  )

  const [data, isFetching] = useReportRecords(from, to, tags, order, orderBy)

  return (
    <div>
      <Grid container spacing={2}>
        <Grid xs={12} md={6}>
          <Box>
            <DatePicker
              id="dateFrom"
              options={{
                autoClose: true,
                format: 'mmm dd, yyyy',
                defaultDate: from,
                setDefaultDate: true,
                maxDate: new Date(),
              }}
              // @ts-ignore
              label={`${intl.formatMessage({ id: 'common.from' })} *`}
              onChange={setFrom}
              s={12}
            />
          </Box>
        </Grid>
        <Grid xs={12} md={6}>
          <Box>
            <DatePicker
              id="dateTo"
              options={{
                autoClose: true,
                format: 'mmm dd, yyyy',
                defaultDate: to,
                setDefaultDate: true,
                maxDate: new Date(),
              }}
              // @ts-ignore
              label={`${intl.formatMessage({ id: 'common.to' })} *`}
              onChange={(d) => setTo(new Date(d.getTime() + dayWithoutSecondInMs))}
              s={12}
            />
          </Box>
        </Grid>
        <Grid xs={12} md={6}>
          <Box px={3}>
            <TagsEditor value={tags} onUpdate={onTagsUpdate} inputClassName="w-full" />
          </Box>
        </Grid>
        <Grid xs={12} md={6} display="flex" alignItems="center">
          <SortByField
            value={{ order, orderBy }}
            options={[
              {
                label: 'by participant',
                value: 'participantName',
              },
              {
                label: 'by activity',
                value: 'activityName',
              },
              {
                label: 'by rate',
                value: 'rate',
              },
            ]}
            onChange={(data) => {
              setOrder(data.order)
              setOrderBy(data.orderBy)
            }}
          />
        </Grid>
      </Grid>
      <ReportBody tags={tags} reportRecords={data} loading={isFetching} />
    </div>
  )
}

const orderStoreKey = 'reports.attendance.order'
const orderByStoreKey = 'reports.attendance.orderBy'
const ReportBody = (props: ComponentProps<typeof ReportByTag>) => {
  const { tags } = props
  if (!tags.length) {
    return (
      <Text type="h6" color="textGray">
        <FormattedMessage id="reports.noTagsSelected" />
      </Text>
    )
  }

  return <ReportByTag {...props} tags={tags} />
}

const dayWithoutSecondInMs = 24 * 60 * 60 * 1000 - 60 * 1000

function subMonth(date: Date) {
  const newDate = new Date(date)
  newDate.setMonth(newDate.getMonth() - 1)
  return newDate
}

function useReportRecords(from: Date, to: Date, tags: string[], order: SortOrder, orderBy: string) {
  const { data, isFetching } = useQuery(
    ['report', from, to, tags, order, orderBy],
    () => {
      if (!tags.length) {
        return
      }
      return getReportByTagRequest(from, to, tags, order, orderBy)
    },
    {
      refetchOnWindowFocus: false,
    }
  )
  const parsedData =
    data?.data.map((r) => ({
      name: r.participantName,
      rate: r.rate,
      activity: r.activityName,
      attended: r.attended,
      total: r.total,
    })) || []

  return [parsedData, isFetching] as const
}
