import React, { ComponentType } from 'react'
import { Header } from '../components/kit/header/Header'

export const withHeader = (Component: ComponentType) => {
  return () => (
    <>
      <Header />
      <Component />
    </>
  )
}
