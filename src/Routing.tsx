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
import { InviteUserPage } from './pages/users/InviteUser'
import { ConfirmInvitePage } from './pages/users/ConfirmInvite'
import { UsersListPage } from './pages/users/UsersList'

const GroupsListPage = withHeader(GroupsListPageLoadable)
const CreateGroupPage = withHeader(CreateGroupPageLoadable)
const EditGroupPage = withHeader(EditGroupPageLoadable)
const GroupPage = withHeader(GroupPageLoadable)
const CreateStudentPage = withHeader(CreateStudentPageLoadable)
const EditStudentPage = withHeader(EditStudentPageLoadable)
const StudentsListPage = withHeader(StudentsListPageLoadable)
const StudentPage = withHeader(StudentPageLoadable)
const SchedulePage = withHeader(SchedulePageLoadable)
const AttendanceEditor = withHeader(AttendanceEditorLoadable)
const CreateOrganizationPage = withHeader(CreateOrganizationPageLoadable)

export const Routing = React.memo(function () {
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
      <Route path={`/:orgId${ROUTES.LOGOUT}`}>
        <LogoutPage />
      </Route>

      <AuthGuardedRoute component={ProfilePage} path="/" exact />
      <AuthGuardedRoute component={DashboardPage} path="/:orgId/" exact />

      <AuthGuardedRoute component={InviteUserPage} path="/:orgId/invite" exact />
      <AuthGuardedRoute component={ConfirmInvitePage} path="/:orgId/invite/confirm/:token" exact />

      {/* Users */}
      {/* <AuthGuardedRoute component={CreateTeacherPage} path={`/:orgId${ROUTES.TEACHERS_ADD}`} exact />
      <AuthGuardedRoute component={EditTeacherPage} path={`/:orgId${ROUTES.TEACHERS_EDIT}/:id`} exact /> */}
      <AuthGuardedRoute component={UsersListPage} path={`/:orgId${ROUTES.USERS_LIST}`} exact />
      {/* <AuthGuardedRoute component={TeacherPage} path={`/:orgId$/{ROUTES.TEACHERS_ROOT}/:id`} exact /> */}

      {/* Teachers */}
      <AuthGuardedRoute component={CreateTeacherPage} path={`/:orgId${ROUTES.TEACHERS_ADD}`} exact />
      <AuthGuardedRoute component={EditTeacherPage} path={`/:orgId${ROUTES.TEACHERS_EDIT}/:id`} exact />
      <AuthGuardedRoute component={TeachersListPage} path={`/:orgId${ROUTES.TEACHERS_LIST}`} exact />
      <AuthGuardedRoute component={TeacherPage} path={`/:orgId${ROUTES.TEACHERS_ROOT}/:id`} exact />

      {/* Groups */}
      <AuthGuardedRoute component={CreateGroupPage} path={`/:orgId${ROUTES.GROUPS_ADD}`} exact />
      <AuthGuardedRoute component={EditGroupPage} path={`/:orgId${ROUTES.GROUPS_EDIT}/:id`} exact />
      <AuthGuardedRoute component={GroupsListPage} path={`/:orgId${ROUTES.GROUPS_LIST}`} exact />
      <AuthGuardedRoute component={GroupPage} path={`/:orgId${ROUTES.GROUPS_ROOT}/:id`} exact />

      {/* Students */}
      <AuthGuardedRoute component={CreateStudentPage} path={`/:orgId${ROUTES.STUDENTS_ADD}`} exact />
      <AuthGuardedRoute component={EditStudentPage} path={`/:orgId${ROUTES.STUDENTS_EDIT}/:id`} exact />
      <AuthGuardedRoute component={StudentsListPage} path={`/:orgId${ROUTES.STUDENTS_LIST}`} exact />
      <AuthGuardedRoute component={StudentPage} path={`/:orgId${ROUTES.STUDENTS_ROOT}/:id`} exact />

      {/* Schedule */}
      <AuthGuardedRoute component={SchedulePage} path={`/:orgId${ROUTES.SCHEDULES_ROOT}`} exact />

      {/* Attendance */}
      <AuthGuardedRoute component={AttendanceEditor} path={`/:orgId${ROUTES.ATTENDANCE_EDIT}/:id`} exact />
      <AuthGuardedRoute component={AttendanceEditor} path={`/:orgId${ROUTES.ATTENDANCE_ADD}`} exact />
      <AuthGuardedRoute component={AttendanceEditor} path={`/:orgId${ROUTES.ATTENDANCE_ADD}/:date`} exact />

      {/* Organizations */}
      <AuthGuardedRoute component={CreateOrganizationPage} path={`${ROUTES.ORGANIZATIONS_ADD}`} exact />

      {/* 404 */}
      <Route path={`/*`}>404</Route>
    </Switch>
  )
})
