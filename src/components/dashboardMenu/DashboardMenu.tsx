import React, { useCallback } from 'react'
import { useHistory } from 'react-router-dom'
import { Action, Fab } from 'react-tiny-fab'
import { useOrgId } from '../../hooks/useOrgId'
import { HasAccess } from '../kit/hasAccess/HasAccess'
import './styles.css'

// TODO: add translations
export const DashboardMenu = () => {
  const history = useHistory()
  const orgId = useOrgId()
  const onTeacherClick = useCallback(() => {
    if (orgId) {
      history.push(`${orgId}/invite`)
    }
  }, [history, orgId])
  const onReportClick = useCallback(() => {}, [])

  // <i className="material-icons">school</i>
  // <i className="material-icons">group_add</i>

  return (
    <span className="fab-container">
      <Fab icon={<i className="material-icons">add</i>} alwaysShowTitle={true}>
        {/* TODO: use translations */}
        <Action text="Report class" onClick={onReportClick}>
          <i className="material-icons">school</i>
        </Action>

        <HasAccess action="MANAGE_TEACHERS">
          <Action text="Invite teacher" onClick={onTeacherClick}>
            <i className="material-icons">person_add</i>
          </Action>
        </HasAccess>
      </Fab>
    </span>
  )
}
