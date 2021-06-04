import React from 'react'
import { Switch, Route } from 'react-router-dom'
import { ROUTES } from './constants'
import { withHeader } from './hocs/withHeader'
import { AuthGuardedRoute } from './components/guardedRoute/GuardedRoute'
import { LoginPage } from './pages/login/LoginPage'
import { DashboardPage } from './pages/dashboard/Dashboard'
import { EditTeacherPage } from './pages/teachers/EditTeacher'
import { CreateTeacherPage } from './pages/teachers/CreateTeacher'
import { TeachersListPage } from './pages/teachers/TeachersList'
import { TeacherPage } from './pages/teachers/Teacher'
import {
  CreateGroupPageLoadable,
  EditGroupPageLoadable,
  GroupsListPageLoadable,
  GroupPageLoadable,
} from './pages/groups'
import {
  StudentsListPageLoadable,
  StudentPageLoadable,
  CreateStudentPageLoadable,
  EditStudentPageLoadable,
} from './pages/students'
import { LogoutPage } from './pages/auth/Logout'
import { SchedulePageLoadable } from './pages/schedules'

export function Routing() {
  return (
    <Switch>
      <AuthGuardedRoute component={DashboardPage} path="/" exact />

      {/* Teachers */}
      <AuthGuardedRoute component={CreateTeacherPage} path={ROUTES.TEACHERS_ADD} exact />
      <AuthGuardedRoute component={EditTeacherPage} path={`${ROUTES.TEACHERS_EDIT}/:id`} exact />
      <AuthGuardedRoute component={TeachersListPage} path={ROUTES.TEACHERS_LIST} exact />
      <AuthGuardedRoute component={TeacherPage} path={`${ROUTES.TEACHERS_ROOT}/:id`} exact />

      {/* Groups */}
      <AuthGuardedRoute component={withHeader(CreateGroupPageLoadable)} path={ROUTES.GROUPS_ADD} exact />
      <AuthGuardedRoute component={withHeader(EditGroupPageLoadable)} path={`${ROUTES.GROUPS_EDIT}/:id`} exact />
      <AuthGuardedRoute component={withHeader(GroupsListPageLoadable)} path={ROUTES.GROUPS_LIST} exact />
      <AuthGuardedRoute component={withHeader(GroupPageLoadable)} path={`${ROUTES.GROUPS_ROOT}/:id`} exact />

      {/* Students */}
      <AuthGuardedRoute component={withHeader(CreateStudentPageLoadable)} path={ROUTES.STUDENTS_ADD} exact />
      <AuthGuardedRoute component={withHeader(EditStudentPageLoadable)} path={`${ROUTES.STUDENTS_EDIT}/:id`} exact />
      <AuthGuardedRoute component={withHeader(StudentsListPageLoadable)} path={ROUTES.STUDENTS_LIST} exact />
      <AuthGuardedRoute component={withHeader(StudentPageLoadable)} path={`${ROUTES.STUDENTS_ROOT}/:id`} exact />

      {/* Schedule */}
      <AuthGuardedRoute component={withHeader(SchedulePageLoadable)} path={`${ROUTES.SCHEDULES_ROOT}`} exact />

      <Route path={ROUTES.LOGIN}>
        <LoginPage />
      </Route>
      <Route path={ROUTES.LOGOUT}>
        <LogoutPage />
      </Route>
    </Switch>
  )
}
