import React, { useCallback } from 'react'
import { useHistory } from 'react-router-dom'
import { Action, Fab } from 'react-tiny-fab'
import { ROUTES } from '../../constants'
import { useAccessManager } from '../../hooks/useAccessManager'
import { useOrgId } from '../../hooks/useOrgId'
import './styles.css'

// TODO: add translations
export const DashboardMenu = () => {
  const history = useHistory()
  const orgId = useOrgId()
  const { hasAccess } = useAccessManager()
  const onTeacherClick = useCallback(() => {
    if (orgId) {
      history.push(`/${orgId}/invite`)
    }
  }, [history, orgId])
  const onReportClick = useCallback(() => {
    if (orgId) {
      history.push(`/${orgId}${ROUTES.ATTENDANCE_ADD}`)
    }
  }, [history, orgId])

  // <i className="material-icons">school</i>
  // <i className="material-icons">group_add</i>

  return (
    <span className="fab-container z-50 relative">
      <Fab icon={<i className="material-icons">add</i>} alwaysShowTitle={true}>
        {/* TODO: use translations */}
        <Action text="Report class" onClick={onReportClick}>
          <i className="material-icons">school</i>
        </Action>

        {hasAccess('MANAGE_TEACHERS') && (
          <Action text="Invite teacher" onClick={onTeacherClick}>
            <i className="material-icons">person_add</i>
          </Action>
        )}
      </Fab>
    </span>
  )
}
