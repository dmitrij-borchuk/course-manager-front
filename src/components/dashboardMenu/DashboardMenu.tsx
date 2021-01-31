import React, { useCallback } from 'react'
import { useHistory } from 'react-router-dom'
import { Action, Fab } from 'react-tiny-fab'
import './styles.css'

// TODO: add translations
export const DashboardMenu = () => {
  const history = useHistory()
  const onTeacherClick = useCallback(() => {
    history.push('/teachers/add')
  }, [history])

  // <i className="material-icons">school</i>
  // <i className="material-icons">group_add</i>

  return (
    <span className="fab-container">
      <Fab icon={<i className="material-icons">add</i>} alwaysShowTitle={true}>
        <Action text="Add teacher" onClick={onTeacherClick}>
          <i className="material-icons">person_add</i>
        </Action>
      </Fab>
    </span>
  )
}
