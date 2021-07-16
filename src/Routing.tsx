import React from 'react'
import { Switch, Route } from 'react-router-dom'
import { ROUTES } from './constants'
import { withHeader } from './hocs/withHeader'
import { AuthGuardedRoute } from './components/guardedRoute/GuardedRoute'
import { LoginPage } from './pages/login/LoginPage'
import { RegisterPage } from './pages/register/RegisterPage'
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
import { AttendanceEditorLoadable } from './pages/attendance'
import { ProfilePage } from './pages/profile/Profile'
import { CreateOrganizationPageLoadable } from './pages/organizations'

export function Routing() {
  return (
    <Switch>
      {/* Default auth flow */}
      <Route path={ROUTES.LOGIN}>
        {/* TODO: add lazy loading */}
        <LoginPage />
      </Route>
      <Route path={ROUTES.REGISTER}>
        {/* TODO: add lazy loading */}
        <RegisterPage />
      </Route>
      <Route path={ROUTES.LOGOUT}>
        <LogoutPage />
      </Route>

      {/* Organization auth flow */}
      <Route path={`/:orgId${ROUTES.LOGIN}`}>
        {/* TODO: add lazy loading */}
        <LoginPage />
      </Route>
      <Route path={`/:orgId${ROUTES.REGISTER}`}>
        {/* TODO: add lazy loading */}
        <RegisterPage />
      </Route>
      <Route path={`/:orgId${ROUTES.LOGOUT}`}>
        <LogoutPage />
      </Route>

      <AuthGuardedRoute component={ProfilePage} path="/" exact />
      <AuthGuardedRoute component={DashboardPage} path="/:orgId/" exact />

      {/* Teachers */}
      <AuthGuardedRoute component={CreateTeacherPage} path={`/:orgId${ROUTES.TEACHERS_ADD}`} exact />
      <AuthGuardedRoute component={EditTeacherPage} path={`/:orgId${ROUTES.TEACHERS_EDIT}/:id`} exact />
      <AuthGuardedRoute component={TeachersListPage} path={`/:orgId${ROUTES.TEACHERS_LIST}`} exact />
      <AuthGuardedRoute component={TeacherPage} path={`/:orgId${ROUTES.TEACHERS_ROOT}/:id`} exact />

      {/* Groups */}
      <AuthGuardedRoute component={withHeader(CreateGroupPageLoadable)} path={`/:orgId${ROUTES.GROUPS_ADD}`} exact />
      <AuthGuardedRoute component={withHeader(EditGroupPageLoadable)} path={`/:orgId${ROUTES.GROUPS_EDIT}/:id`} exact />
      <AuthGuardedRoute component={withHeader(GroupsListPageLoadable)} path={`/:orgId${ROUTES.GROUPS_LIST}`} exact />
      <AuthGuardedRoute component={withHeader(GroupPageLoadable)} path={`/:orgId${ROUTES.GROUPS_ROOT}/:id`} exact />

      {/* Students */}
      <AuthGuardedRoute
        component={withHeader(CreateStudentPageLoadable)}
        path={`/:orgId${ROUTES.STUDENTS_ADD}`}
        exact
      />
      <AuthGuardedRoute
        component={withHeader(EditStudentPageLoadable)}
        path={`/:orgId${ROUTES.STUDENTS_EDIT}/:id`}
        exact
      />
      <AuthGuardedRoute
        component={withHeader(StudentsListPageLoadable)}
        path={`/:orgId${ROUTES.STUDENTS_LIST}`}
        exact
      />
      <AuthGuardedRoute component={withHeader(StudentPageLoadable)} path={`/:orgId${ROUTES.STUDENTS_ROOT}/:id`} exact />

      {/* Schedule */}
      <AuthGuardedRoute component={withHeader(SchedulePageLoadable)} path={`/:orgId${ROUTES.SCHEDULES_ROOT}`} exact />

      {/* Attendance */}
      <AuthGuardedRoute
        component={withHeader(AttendanceEditorLoadable)}
        path={`/:orgId${ROUTES.ATTENDANCE_EDIT}/:id/:date`}
        exact
      />

      {/* Organizations */}
      <AuthGuardedRoute
        component={withHeader(CreateOrganizationPageLoadable)}
        path={`${ROUTES.ORGANIZATIONS_ADD}`}
        exact
      />
    </Switch>
  )
}
