import React from 'react'
import { Helmet } from 'react-helmet'
import { Container } from '@mui/material'
import { Header } from 'components/kit/header/Header'
import { TITLE_POSTFIX } from 'config'

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

      <Container sx={{ p: 2 }}>{children}</Container>
    </>
  )
}
