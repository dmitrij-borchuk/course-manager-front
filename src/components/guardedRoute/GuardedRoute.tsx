import React, { useCallback, useEffect } from 'react'
import { Route, Redirect, RouteProps, RouteComponentProps } from 'react-router-dom'
import { ROUTES } from '../../constants'
import { useAuthState, useUsersState } from '../../store'
import { useAppDispatch, useAppSelector } from 'store/hooks'
import { Loader } from 'components/kit/loader/Loader'
import { initiateApp } from 'store/applicationSlice'

interface GuardedRouteProps extends RouteProps {
  component: React.ComponentType<RouteComponentProps>
  otherwise: React.ComponentType<RouteComponentProps>
  condition: boolean
}
export const GuardedRoute: React.FC<GuardedRouteProps> = ({
  component: Component,
  condition,
  otherwise: Otherwise,
  ...rest
}) => {
  return <Route {...rest} render={(props) => (condition ? <Component {...props} /> : <Otherwise {...props} />)} />
}

interface AuthGuardedRouteProps extends RouteProps {
  component: React.ComponentType<RouteComponentProps>
}
export const AuthGuardedRoute: React.FC<AuthGuardedRouteProps> = ({ ...rest }) => {
  const { currentUser } = useAuthState()
  return (
    <Initiator>
      <GuardedRoute condition={!!currentUser} otherwise={() => <Redirect to={ROUTES.LOGIN} />} {...rest} />
    </Initiator>
  )
}

export default GuardedRoute

function Initiator({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch()
  const authUser = useAppSelector((state) => state.application.auth.data)
  const initiatedApp = useAppSelector((state) => state.application.status.initiated)
  const { fetchProfile, profile } = useUsersState()

  useEffect(() => {
    if (authUser && !profile) {
      fetchProfile()
    }
  }, [fetchProfile, authUser, profile])
  const initiate = useCallback(async () => {
    await dispatch(initiateApp())
  }, [dispatch])

  useEffect(() => {
    if (!initiatedApp) {
      initiate()
    }
  }, [initiate, initiatedApp])

  if (!initiatedApp) {
    return (
      <div>
        <Loader show data-testid="app-preloader" />
      </div>
    )
  }

  return <>{children}</>
}
