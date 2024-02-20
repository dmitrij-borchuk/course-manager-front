import React from 'react'
import { Helmet } from 'react-helmet'
import { Container } from '@mui/material'
import Toolbar from '@mui/material/Toolbar'
import Box from '@mui/material/Box'
import { Header } from 'components/kit/header/Header'
import { TITLE_POSTFIX } from 'config'
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

      <Box sx={{ display: 'flex' }}>
        <NavBar />
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
          {/* To make some gap under the header */}
          <Toolbar />

          <Container sx={{ p: 2 }}>{children}</Container>
        </Box>
      </Box>
    </>
  )
}
