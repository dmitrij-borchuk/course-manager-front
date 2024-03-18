import React from 'react'
import { Helmet } from 'react-helmet'
import Toolbar from '@mui/material/Toolbar'
import Box from '@mui/material/Box'
import { Header } from 'components/kit/header/Header'
import { DRAWER_WIDTH, TITLE_POSTFIX } from 'config'
import { NavBar } from './NavBar'

type Props = {
  title: string
  children?: React.ReactNode
}
export function GeneralPage(props: Props) {
  const { title, children } = props
  return (
    <>
      <Helmet>
        <title>
          {title}
          {TITLE_POSTFIX}
        </title>
      </Helmet>

      <Header />

      <Box display="flex" height="100%">
        <NavBar />
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 3,
            width: { md: `calc(100% - ${DRAWER_WIDTH}px)` },
            maxWidth: '100%',
            overflow: 'auto',
          }}
        >
          {/* To make some gap under the header */}
          <Toolbar />

          {children}
        </Box>
      </Box>
    </>
  )
}
