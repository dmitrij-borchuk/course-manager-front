import React, { useState } from 'react'
import { Box, Button, Paper, TextField, Typography } from '@mui/material'
import { useQuery } from 'react-query'
import { getReportByPromptRequest } from 'modules/reports/api'

export function ReportByPrompt() {
  const [value, setValue] = useState('Groups list of Dmytro Borchuk')
  const { data, refetch, isFetching } = useQuery<any>(
    ['reportByPrompt', value],
    () => {
      return getReportByPromptRequest(value)
    },
    {
      refetchOnWindowFocus: false,
      enabled: false,
      retry: false,
    }
  )
  const [results, setResults] = useState<any>(JSON.parse(localStorage.getItem('reportByPrompt') || '[]'))
  // const results = JSON.parse(localStorage.getItem('reportByPrompt') || '[]')
  // console.log('=-= 🚀 ~ ReportByPrompt ~ data:', data)
  // const answer = data?.data.content
  const onSubmit = async () => {
    console.log('=-= submit', value)
    const { data } = await refetch()
    console.log('=-= 🚀 ~ onSubmit ~ data:', data)
    if (data) {
      const toSave = {
        req: value,
        res: data?.data?.content,
      }
      const previous = JSON.parse(localStorage.getItem('reportByPrompt') || '[]')
      localStorage.setItem('reportByPrompt', JSON.stringify(previous.concat(toSave)))
      setResults(previous.concat(toSave))
    }
  }

  return (
    <Box>
      <TextField value={value} onChange={(e) => setValue(e.target.value)} fullWidth />
      <Button onClick={onSubmit} disabled={isFetching}>
        Send
      </Button>
      {results.map((item: any) => (
        <Paper elevation={2} sx={{ p: 2, mt: 2 }}>
          <Typography variant="h6">{item.req}</Typography>
          <Typography variant="body1" sx={{ whiteSpace: 'pre' }}>
            {item.res}
          </Typography>
        </Paper>
      ))}
    </Box>
  )
}
