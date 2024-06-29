import React from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'
import { ROUTES } from './constants'
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
import { AdminBackupPageLoadable, AdminPageLoadable } from './pages/admin'
import { ProfilePage } from 'pages/profile/ProfilePage'
import { SettingsPage } from 'modules/settings/components/SettingsPage'
import { withGeneralPageLayout } from 'hocs/withGeneralPageLayout'
import { useAppSelector } from 'store/hooks'

const GroupsListPage = withGeneralPageLayout(GroupsListPageLoadable, 'Groups')
const CreateGroupPage = withGeneralPageLayout(CreateGroupPageLoadable, 'Create Group')
const EditGroupPage = withGeneralPageLayout(EditGroupPageLoadable, 'Edit Group')
const GroupPage = withGeneralPageLayout(GroupPageLoadable, 'Group')

const CreateStudentPage = withGeneralPageLayout(CreateStudentPageLoadable, 'Create Student')
const EditStudentPage = withGeneralPageLayout(EditStudentPageLoadable, 'Edit Student')
const StudentInGroupPage = StudentInGroupPageLoadable
const StudentsListPage = withGeneralPageLayout(StudentsListPageLoadable, 'Students')
const StudentPage = withGeneralPageLayout(StudentPageLoadable, 'Student')
const StudentImportPage = withGeneralPageLayout(StudentImportPageLoadable, 'Import Students')

const SchedulePage = withGeneralPageLayout(SchedulePageLoadable, 'Schedule')
const AttendanceEditor = withGeneralPageLayout(AttendanceEditorLoadable, 'Attendance editor')

const CreateOrganizationPage = withGeneralPageLayout(CreateOrganizationPageLoadable, 'Create Organization')

const TeachersListWithHeader = withGeneralPageLayout(TeachersListPage, 'Teachers')
const ReportsPage = withGeneralPageLayout(ReportsPageLoadable, 'Reports')
const AdminPage = () => (
  <>
    <AdminPageLoadable />
  </>
)
const BackupPage = () => (
  <>
    <AdminBackupPageLoadable />
  </>
)

export const Routing = React.memo(function () {
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
      <AuthGuardedRoute component={BackupPage} path="/admin/backup" exact />
      <AuthGuardedRoute component={AdminPage} path="/admin" exact />

      <Route component={ConfirmInvitePage} path="/invite/confirm/:token" exact />

      {/* Organizations */}
      <AuthGuardedRoute component={CreateOrganizationPage} path={`${ROUTES.ORGANIZATIONS_ADD}`} exact />
      <AuthGuardedRoute component={OrganizationsPage} path={`${ROUTES.ORGANIZATIONS_ROOT}`} exact />

      <AuthGuardedRoute component={OrganizationGuardedRoute} path="/" />

      {/* 404 */}
      <Route path={`/*`}>404</Route>
    </Switch>
  )
})

const OrganizationGuardedRoute = () => {
  const currentOrg = useAppSelector((state) => state.organizations.currentOrg.data)

  if (!currentOrg) {
    return <Redirect to={ROUTES.ORGANIZATIONS_ROOT} />
  }

  return (
    <Switch>
      <Route component={DashboardPage} path="/" exact />

      <Route component={InviteUserPage} path="/invite" exact />

      {/* Users */}
      {/* <Route component={CreateTeacherPage} path={`${ROUTES.TEACHERS_ADD}`} exact />
      <Route component={EditTeacherPage} path={`${ROUTES.TEACHERS_EDIT}/:id`} exact /> */}
      {/* <Route component={TeacherPage} path={`$/{ROUTES.TEACHERS_ROOT}/:id`} exact /> */}

      {/* Teachers */}
      {/* TODO: rename to `users` */}
      <Route component={TeachersListWithHeader} path={`${ROUTES.TEACHERS_LIST}`} exact />
      <Route component={TeacherPage} path={`${ROUTES.TEACHERS_ROOT}/:id`} exact />

      {/* Groups */}
      <Route component={CreateGroupPage} path={`${ROUTES.GROUPS_ADD}`} exact />
      <Route component={EditGroupPage} path={`${ROUTES.GROUPS_EDIT}/:id`} exact />
      <Route component={GroupsListPage} path={`${ROUTES.GROUPS_LIST}`} exact />
      <Route component={GroupPage} path={`${ROUTES.GROUPS_ROOT}/:id`} exact />

      {/* Students */}
      <Route component={CreateStudentPage} path={`${ROUTES.STUDENTS_ADD}`} exact />
      <Route component={EditStudentPage} path={`${ROUTES.STUDENTS_EDIT}/:id`} exact />
      <Route component={StudentsListPage} path={`${ROUTES.STUDENTS_LIST}`} exact />
      <Route component={StudentPage} path={`${ROUTES.STUDENTS_ROOT}/:id`} exact />
      <Route component={() => <StudentInGroupPage />} path={`${ROUTES.STUDENTS_BY_ACTIVITY}`} exact />

      {/* Schedule */}
      <Route component={SchedulePage} path={`${ROUTES.SCHEDULES_ROOT}`} exact />

      {/* Attendance */}
      <Route component={AttendanceEditor} path={`${ROUTES.ATTENDANCE_EDIT}/:id`} exact />
      <Route component={AttendanceEditor} path={`${ROUTES.ATTENDANCE_ADD}`} exact />
      <Route component={AttendanceEditor} path={`${ROUTES.ATTENDANCE_ADD}/:date`} exact />

      {/* Reports */}
      <Route component={ReportsPage} path={`${ROUTES.REPORTS_ROOT}`} exact />

      {/* Settings */}
      <Route component={SettingsPage} path={`${ROUTES.SETTINGS_API_KEY}`} exact />

      {/* Import */}
      <Route component={StudentImportPage} path="/import" exact />

      <Route component={ProfilePage} path={`${ROUTES.MY_WORK}`} exact />
    </Switch>
  )
}
