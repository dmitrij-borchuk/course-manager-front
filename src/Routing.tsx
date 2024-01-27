import React, { useEffect } from 'react'
import { Switch, Route, Link, useLocation } from 'react-router-dom'
import { ROUTES } from './constants'
import { withHeader } from './hocs/withHeader'
import { AuthGuardedRoute } from './components/guardedRoute/GuardedRoute'
import { LoginPageLoadable } from './pages/login'
import { ResetPasswordPage } from './pages/resetPassword/ResetPasswordPage'
import { RegisterPage } from './pages/register/RegisterPage'
import { DashboardPage } from './pages/dashboard/Dashboard'
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
  StudentInGroupPageLoadable,
} from './pages/students'
import { LogoutPage } from './pages/auth/Logout'
import { SchedulePageLoadable } from './pages/schedules'
import { AttendanceEditorLoadable } from './pages/attendance'
import { OrganizationsPage } from './pages/organizations/Organizations'
import { CreateOrganizationPageLoadable } from './pages/organizations'
import { InviteUserPage } from './pages/users/InviteUser'
import { ConfirmInvitePage } from './pages/users/ConfirmInvite'
import { StudentImportPageLoadable } from './pages/import/students'
import { ReportsPageLoadable } from './pages/reports'
import { AdminPageLoadable } from './pages/admin'
import { useAuthState, useOrganizationsState, useUsersState } from './store'
import { useCurrentOrg } from './hooks/useCurrentOrg'
import { Loader } from './components/kit/loader/Loader'
import { FormattedMessage } from 'react-intl'
import { Text } from './components/kit/text/Text'
import { setHeader } from './api/request'
import { ProfilePage } from 'pages/profile/ProfilePage'

const GroupsListPage = withHeader(GroupsListPageLoadable)
const CreateGroupPage = withHeader(CreateGroupPageLoadable)
const EditGroupPage = withHeader(EditGroupPageLoadable)
const GroupPage = withHeader(GroupPageLoadable)
const CreateStudentPage = withHeader(CreateStudentPageLoadable)
const EditStudentPage = withHeader(EditStudentPageLoadable)
const StudentInGroupPage = withHeader(StudentInGroupPageLoadable)
const StudentsListPage = withHeader(StudentsListPageLoadable)
const StudentPage = withHeader(StudentPageLoadable)
const SchedulePage = withHeader(SchedulePageLoadable)
const AttendanceEditor = withHeader(AttendanceEditorLoadable)
const CreateOrganizationPage = withHeader(CreateOrganizationPageLoadable)
const TeachersListWithHeader = withHeader(TeachersListPage)
const StudentImportPage = withHeader(StudentImportPageLoadable)
const ReportsPage = withHeader(ReportsPageLoadable)
const AdminPage = () => (
  <>
    <AdminPageLoadable />
  </>
)

export const Routing = React.memo(function () {
  const { currentUser } = useAuthState()
  const { fetchProfile } = useUsersState()
  useEffect(() => {
    if (currentUser) {
      fetchProfile()
    }
  }, [fetchProfile, currentUser])

  return (
    <Switch>
      {/* Default auth flow */}
      <Route path={ROUTES.LOGIN}>
        <LoginPageLoadable />
      </Route>
      <Route path={ROUTES.RESET}>
        {/* TODO: add lazy loading */}
        <ResetPasswordPage />
      </Route>
      <Route path={ROUTES.REGISTER}>
        {/* TODO: add lazy loading */}
        <RegisterPage />
      </Route>
      <Route path={ROUTES.LOGOUT}>
        <LogoutPage />
      </Route>

      {/* Admin */}
      <AuthGuardedRoute component={AdminPage} path="/admin" exact />

      <Route component={ConfirmInvitePage} path="/:orgId/invite/confirm/:token" exact />

      {/* Organizations */}
      <AuthGuardedRoute component={CreateOrganizationPage} path={`${ROUTES.ORGANIZATIONS_ADD}`} exact />
      <AuthGuardedRoute component={OrganizationsPage} path="/" exact />

      <Route path={`/:orgId`}>
        <OrganizationGuardedRoute />
      </Route>

      {/* 404 */}
      <Route path={`/*`}>404</Route>
    </Switch>
  )
})

const OrganizationGuardedRoute = () => {
  const organization = useCurrentOrg()
  const { loading } = useOrganizationsState()
  const location = useLocation()

  useEffect(() => {
    const parts = location.pathname.split('/')
    setHeader('X-Organization', parts[1])

    return () => {
      setHeader('X-Organization', undefined)
    }
  }, [location])

  if (loading) {
    return <Loader show data-testid="org-preloader" />
  }

  if (!organization) {
    return (
      <Text type="h3">
        <FormattedMessage id="organizations.notFound" />{' '}
        <Link to="/">
          <FormattedMessage id="organizations.notFound.backHome" />
        </Link>
      </Text>
    )
  }

  return (
    <Switch>
      {/* Organization auth flow */}
      <Route path={`/:orgId${ROUTES.LOGIN}`}>
        {/* TODO: add lazy loading */}
        <LoginPageLoadable />
      </Route>
      <Route path={`/:orgId${ROUTES.LOGOUT}`}>
        <LogoutPage />
      </Route>
      <Route path={`/:orgId${ROUTES.RESET}`}>
        {/* TODO: add lazy loading */}
        <ResetPasswordPage />
      </Route>

      <AuthGuardedRoute component={DashboardPage} path="/:orgId/" exact />

      <AuthGuardedRoute component={InviteUserPage} path="/:orgId/invite" exact />

      {/* Users */}
      {/* <AuthGuardedRoute component={CreateTeacherPage} path={`/:orgId${ROUTES.TEACHERS_ADD}`} exact />
      <AuthGuardedRoute component={EditTeacherPage} path={`/:orgId${ROUTES.TEACHERS_EDIT}/:id`} exact /> */}
      {/* <AuthGuardedRoute component={TeacherPage} path={`/:orgId$/{ROUTES.TEACHERS_ROOT}/:id`} exact /> */}

      {/* Teachers */}
      {/* TODO: rename to `users` */}
      <AuthGuardedRoute component={TeachersListWithHeader} path={`/:orgId${ROUTES.TEACHERS_LIST}`} exact />
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
      <AuthGuardedRoute component={StudentInGroupPage} path={`/:orgId${ROUTES.STUDENTS_BY_ACTIVITY}`} exact />

      {/* Schedule */}
      <AuthGuardedRoute component={SchedulePage} path={`/:orgId${ROUTES.SCHEDULES_ROOT}`} exact />

      {/* Attendance */}
      <AuthGuardedRoute component={AttendanceEditor} path={`/:orgId${ROUTES.ATTENDANCE_EDIT}/:id`} exact />
      <AuthGuardedRoute component={AttendanceEditor} path={`/:orgId${ROUTES.ATTENDANCE_ADD}`} exact />
      <AuthGuardedRoute component={AttendanceEditor} path={`/:orgId${ROUTES.ATTENDANCE_ADD}/:date`} exact />

      {/* Reports */}
      <AuthGuardedRoute component={ReportsPage} path={`/:orgId${ROUTES.REPORTS_ROOT}`} exact />

      {/* Import */}
      <AuthGuardedRoute component={StudentImportPage} path="/:orgId/import" exact />

      <AuthGuardedRoute component={ProfilePage} path="/:orgId/profile" exact />
    </Switch>
  )
}
