export const messages = {
  'common.submitLabel': 'Submit',
  'common.form.id.label': 'Identifier',
  'common.form.name.label': 'Name',
  'common.form.username.label': 'Username',
  'common.form.email.label': 'Email',
  'common.form.password.label': 'Password',
  'common.form.description.label': 'Description',
  'common.form.tag.label': 'Tag',
  'common.form.tags.label': 'Tags',
  'common.form.newTag.label': 'New tag',
  'common.form.required': 'This field is required',
  'common.dialog.btn.yes': 'Yes',
  'common.dialog.btn.save': 'Save',
  'common.dialog.btn.no': 'No',
  'common.dialog.btn.ok': 'Ok',
  'common.dialog.btn.cancel': 'Cancel',
  'common.list.empty': 'The list is empty',
  'common.unknownName': 'Unknown name',
  'common.date': 'Date',
  'common.sort.asc': 'Ascending',
  'common.sort.desc': 'Descending',
  'common.from': 'From',
  'common.to': 'To',
  'common.name.label': 'Name',
  'common.unknownError': 'Unknown error',
  'common.edit': 'Edit',
  'common.filter': 'Filter',
  'common.remove': 'Remove',
  'common.students': 'Students',

  'Auth.form.error.invalid': 'Identifier or password invalid.',
  'Auth.form.error.500': 'Something went wrong',
  'auth.loginLink.separator': 'or',
  'auth.loginLink.title': 'Login',
  'auth.registerLink.separator': 'or',
  'auth.registerLink.label': 'Create account',
  'auth.register.title': 'Register',
  'auth.register.success': 'You have been successfully registered a fresh account',
  'auth.resetLink.label': 'Forgot password?',
  'auth.reset.success': 'Reset password email has been sent.',
  'auth.login.wrongLoginPassword': 'Login or password is incorrect',
  'header.nav.dashboard': 'Dashboard',
  'header.nav.users': 'Users',
  'header.nav.teachers': 'Users',
  'header.nav.groups': 'Groups',
  'header.nav.students': 'Students',
  'header.nav.reports': 'Reports',
  'header.nav.logout': 'Logout',
  'header.nav.login': 'Sign in',
  'header.nav.settings': 'Settings',

  'teachers.list.title': 'Users',
  'teachers.list.empty': 'There are no users yet',
  'teachers.add.title': 'Invite teacher',
  'teachers.edit.title': 'Edit teacher',
  'teachers.groups.empty': "The teacher doesn't have any classes",
  'teachers.delete.header': 'Remove teacher',
  'teachers.delete.text': 'Are you sure you want to delete this teacher?',
  'teachers.groups.assignDialog.header': 'Assign Groups',
  'teachers.groups.assignBtn.label': 'Assign Groups',
  'teachers.editGroups.success': "Teacher's groups have been successfully updated",
  'teachers.invite.copyAndClose': 'Copy link to clipboard and close',
  'teachers.invite.linkCopied': 'The link have been successfully copied to the clipboard',

  'groups.list.title': 'Groups',
  'groups.add.title': 'Add group',
  'groups.edit.title': 'Edit group',
  'groups.schedule.title': 'Schedule',
  'groups.schedule.empty': 'Schedule is not defined',
  'groups.schedule.assignBtn.label': 'Define Schedule',
  'groups.teacher.title': 'Teacher',
  'groups.teacher.empty': 'No teacher assigned',
  'groups.teacher.assignBtn.label': 'Assign Teacher',
  'groups.teacher.assignDialog.header': 'Assign Teacher',
  'groups.students.assignBtn.label': 'Assign Students',
  'groups.students.assignDialog.header': 'Assign Students',
  'groups.students.empty': 'No students assigned',
  'groups.delete.header': 'Remove group',
  'groups.delete.text': 'Are you sure you want to delete this group?',
  'groups.closeConfirmation.header': 'Close group?',
  'groups.closeConfirmation.text': 'Are you sure you want to close this group? All information will be saved.',
  'groups.create.success': 'Group has been successfully created',
  'groups.edit.success': 'Group has been successfully updated',
  'groups.assignTeacher.success': 'Teacher has been successfully assigned',
  'groups.assignStudents.success': 'Students have been successfully assigned',
  'groups.unassignStudents.success': 'Students have been successfully removed from group',
  'groups.unassignStudents.error': 'Error while removing student from group: {message}',
  'groups.assignStudents.namePlaceholder': 'Enter a name',
  'groups.assignStudents.moreNamePlaceholder': '+ name',
  'groups.studentList.removeBtn': 'Remove from group',
  'groups.closeBtn.label': 'Close group',
  'groups.deleteBtn.label': 'Delete',
  'groups.closed.message': 'This group was closed by {name} {date}',
  'groups.closed.message.simple': 'This group is closed',
  'groups.moreMenu.title': 'more',
  'groups.filtering.showArchived.inputLabel': 'Show archived',
  'groups.archived.name': '{name} (Archived)',
  'groups.unassignStudents.tooltip': 'Unassign from group',
  'groups.unassignStudents.confirmation.title': 'Are you sure you want to unassign {participant} from {name}?',
  'groups.unassignStudents.comment.title': 'Reason',

  'students.add.title': 'Add student',
  'students.add': 'Add student',
  'students.edit.title': 'Edit student',
  'students.list.title': 'Students',
  'students.groups.empty': 'Student is not attending any classes',
  'students.groups.tableHeader.start': 'Start',
  'students.groups.tableHeader.status': 'Status',
  'students.groups.archived': 'Group archived',
  'students.groups.activeParticipation': 'Active participation',
  'students.groups.left': 'Left {date}',
  'students.delete.header': 'Remove student',
  'students.delete.text': 'Are you sure you want to delete this student?',
  'students.groups.assignDialog.header': 'Assign Groups',
  'students.groups.assignBtn.label': 'Assign Groups',
  'students.create.success': 'Student has been successfully created',
  'students.edit.success': 'Student has been successfully updated',
  'students.assignGroups.success': 'Groups have been successfully assigned',
  'students.tags.empty': 'No tags have been assigned',
  'students.attendance.details.label': 'Attendance details',
  'students.attendance.attended': 'Attended',
  'students.attendance.missed': 'Missed',
  'students.creation.existingConfirmation.title': 'Create anyway?',
  'students.creation.existingConfirmation.body':
    'Looks like the student with such name ({name}) already exists. Do you want to create one more?',

  'schedule.list.title': 'Schedule',
  'schedule.form.title': 'Schedule',
  'schedule.form.start': 'Start date',
  'schedule.form.end': 'End date',
  'schedule.form.cron.required': 'Please select at least one day',

  'profile.user.noName': 'No name',
  'profile.user.nameChanged': 'Name has been changed successfully',

  'organizations.header.line1': 'Welcome back!',
  'organizations.header.line2': 'Choose an organization below to get back to working with your team.',
  'organizations.notFound': 'Organization not found',
  'organizations.notFound.backHome': 'back to home',
  'organizations.add.title': 'Add organization',
  'organizations.edit.title': 'Edit organization',
  'organizations.edit.noUserId': 'Looks like user is logged out',
  'organizations.edit.conflict': 'Organization identifier is taken',

  'users.invite.title': 'Invite user',
  'users.invite.btn.label': 'Invite user',
  'users.invite.confirmation.needLogin': 'You need to be signed in to proceed',
  'users.invite.confirmation.loginLink': 'Go to the login',
  'users.invite.message': 'You have been invited to organization "{organizationName}" by {userName}.',
  'users.invite.success': 'User has been invited successfully',
  'users.invite.needLogin': 'Please login/register to accept invitation',
  'users.list.title': 'Users',
  'users.list.empty': 'There is no users yet',

  'attendance.header.add': 'Add Attendance',
  'attendance.students.list.empty': 'No students assigned to this group',
  'attendance.group.notSelected': 'Please select group',
  'attendance.header.edit': 'Edit Attendance',
  'attendance.groupSelector.placeholder': 'Group',
  'attendance.edit.success': 'Report has been successfully submitted',
  'attendance.delete.header': 'Remove attendance report',
  'attendance.delete.text': 'Are you sure you want to delete this attendance report?',
  'attendance.listItem.header.title': 'Attendance Rate',
  'attendance.add.label': 'Add item',

  'import.student.header': 'Import students',
  'import.student.file.label': 'file',
  'import.student.name.label': 'Key for the name',
  'import.student.name': 'Name',
  'import.student.tags.label': 'Key for the tags',
  'import.student.tags': 'Tags',
  'import.student.tags.isMultiple.label': 'Is multiple tags',
  'import.form.read': 'Read',
  'import.preview.header': 'Preview',
  'import.parse.emptyName': 'All records should have name value in the column {column}',
  'import.parse.success': 'Please review the result and submit data to the server by clicking "Submit" under the table',
  'import.submitting.success': 'You have successfully imported new records',
  'import.fileType.json': 'JSON',
  'import.fileType.csv': 'CSV',

  'reports.header': 'Reports',
  'reports.submitButton': 'Download',
  'reports.open': 'Open in new tab',
  'reports.tabs.byGroup': 'By group',
  'reports.tabs.byTag': 'By tag',
  'reports.tabs.byFilters': 'By filters',
  'reports.tabs.byFilters.iconTitle': 'Experimental',
  'reports.byFilters.generateBtn.label': 'Generate report',
  'reports.byFilters.emptyFilters': 'No filters so far',
  'reports.noGroups': 'Please create some group to be able to generate report',
  'reports.noGroupSelected': 'Please select a group to be able to generate report',
  'reports.sortOrder': 'Sort order',
  'reports.noTagsSelected': 'Please select at least one tag to be able to generate report',
  'reports.noReports': 'N/A',
  'reports.groupSelector.label': 'Group',
  'reports.fieldInput.label': 'Field',
  'reports.operationInput.label': 'Operation',
  'reports.addFilterBtn.label': 'Add filter',
  'reports.valueInput.label': 'Value',
  'reports.filter.group.label': 'Group',

  'calendar.previousBtn.label': 'Previous',
  'calendar.nextBtn.label': 'Next',

  'myWork.link.title': 'My work',

  'settings.nav.apiKey.label': 'API Key',
  'settings.apiKey.keyField.label': 'API Key',
  'settings.apiKey.generateBtn.label': 'Regenerate API Key',
  'settings.apiKey.info':
    'API key is used to authenticate your application to get data from b2b API. Copy API key after creation and save it in the safe place. You will not be able to view it again. You can regenerate new key anytime, but old key will be invalidated.',
}

export default messages
