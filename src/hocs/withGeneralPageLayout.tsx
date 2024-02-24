import { ComponentType } from 'react'
import { GeneralPage } from 'components/layouts/GeneralPage'

export const withGeneralPageLayout = (Component: ComponentType, title: string) => {
  return () => (
    <GeneralPage title={title}>
      <Component />
    </GeneralPage>
  )
}
