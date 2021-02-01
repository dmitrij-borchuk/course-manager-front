import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /** The `JSON` scalar type represents JSON values as specified by [ECMA-404](http://www.ecma-international.org/publications/files/ECMA-ST/ECMA-404.pdf). */
  JSON: any;
  /** A date-time string at UTC, such as 2007-12-03T10:15:30Z, compliant with the `date-time` format outlined in section 5.6 of the RFC 3339 profile of the ISO 8601 standard for representation of dates and times using the Gregorian calendar. */
  DateTime: any;
  /** A time string with format: HH:mm:ss.SSS */
  Time: any;
  /** A date string, such as 2007-12-03, compliant with the `full-date` format outlined in section 5.6 of the RFC 3339 profile of the ISO 8601 standard for representation of dates and times using the Gregorian calendar. */
  Date: any;
  /** The `Long` scalar type represents 52-bit integers */
  Long: any;
  /** The `Upload` scalar type represents a file upload. */
  Upload: any;
};

export type FileInfoInput = {
  name?: Maybe<Scalars['String']>;
  alternativeText?: Maybe<Scalars['String']>;
  caption?: Maybe<Scalars['String']>;
};

export type UsersPermissionsMe = {
  __typename?: 'UsersPermissionsMe';
  id: Scalars['ID'];
  username: Scalars['String'];
  email: Scalars['String'];
  confirmed?: Maybe<Scalars['Boolean']>;
  blocked?: Maybe<Scalars['Boolean']>;
  role?: Maybe<UsersPermissionsMeRole>;
};

export type UsersPermissionsMeRole = {
  __typename?: 'UsersPermissionsMeRole';
  id: Scalars['ID'];
  name: Scalars['String'];
  description?: Maybe<Scalars['String']>;
  type?: Maybe<Scalars['String']>;
};

export type UsersPermissionsRegisterInput = {
  username: Scalars['String'];
  email: Scalars['String'];
  password: Scalars['String'];
};

export type UsersPermissionsLoginInput = {
  identifier: Scalars['String'];
  password: Scalars['String'];
  provider?: Maybe<Scalars['String']>;
};

export type UsersPermissionsLoginPayload = {
  __typename?: 'UsersPermissionsLoginPayload';
  jwt?: Maybe<Scalars['String']>;
  user: UsersPermissionsMe;
};

export type UserPermissionsPasswordPayload = {
  __typename?: 'UserPermissionsPasswordPayload';
  ok: Scalars['Boolean'];
};

export type Attendance = {
  __typename?: 'Attendance';
  id: Scalars['ID'];
  created_at: Scalars['DateTime'];
  updated_at: Scalars['DateTime'];
  student?: Maybe<Student>;
  group?: Maybe<Group>;
  date: Scalars['DateTime'];
  published_at?: Maybe<Scalars['DateTime']>;
};

export type AttendanceConnection = {
  __typename?: 'AttendanceConnection';
  values?: Maybe<Array<Maybe<Attendance>>>;
  groupBy?: Maybe<AttendanceGroupBy>;
  aggregate?: Maybe<AttendanceAggregator>;
};

export type AttendanceAggregator = {
  __typename?: 'AttendanceAggregator';
  count?: Maybe<Scalars['Int']>;
  totalCount?: Maybe<Scalars['Int']>;
};

export type AttendanceGroupBy = {
  __typename?: 'AttendanceGroupBy';
  id?: Maybe<Array<Maybe<AttendanceConnectionId>>>;
  created_at?: Maybe<Array<Maybe<AttendanceConnectionCreated_At>>>;
  updated_at?: Maybe<Array<Maybe<AttendanceConnectionUpdated_At>>>;
  student?: Maybe<Array<Maybe<AttendanceConnectionStudent>>>;
  group?: Maybe<Array<Maybe<AttendanceConnectionGroup>>>;
  date?: Maybe<Array<Maybe<AttendanceConnectionDate>>>;
  published_at?: Maybe<Array<Maybe<AttendanceConnectionPublished_At>>>;
};

export type AttendanceConnectionId = {
  __typename?: 'AttendanceConnectionId';
  key?: Maybe<Scalars['ID']>;
  connection?: Maybe<AttendanceConnection>;
};

export type AttendanceConnectionCreated_At = {
  __typename?: 'AttendanceConnectionCreated_at';
  key?: Maybe<Scalars['DateTime']>;
  connection?: Maybe<AttendanceConnection>;
};

export type AttendanceConnectionUpdated_At = {
  __typename?: 'AttendanceConnectionUpdated_at';
  key?: Maybe<Scalars['DateTime']>;
  connection?: Maybe<AttendanceConnection>;
};

export type AttendanceConnectionStudent = {
  __typename?: 'AttendanceConnectionStudent';
  key?: Maybe<Scalars['ID']>;
  connection?: Maybe<AttendanceConnection>;
};

export type AttendanceConnectionGroup = {
  __typename?: 'AttendanceConnectionGroup';
  key?: Maybe<Scalars['ID']>;
  connection?: Maybe<AttendanceConnection>;
};

export type AttendanceConnectionDate = {
  __typename?: 'AttendanceConnectionDate';
  key?: Maybe<Scalars['DateTime']>;
  connection?: Maybe<AttendanceConnection>;
};

export type AttendanceConnectionPublished_At = {
  __typename?: 'AttendanceConnectionPublished_at';
  key?: Maybe<Scalars['DateTime']>;
  connection?: Maybe<AttendanceConnection>;
};

export type AttendanceInput = {
  student?: Maybe<Scalars['ID']>;
  group?: Maybe<Scalars['ID']>;
  date: Scalars['DateTime'];
  published_at?: Maybe<Scalars['DateTime']>;
  created_by?: Maybe<Scalars['ID']>;
  updated_by?: Maybe<Scalars['ID']>;
};

export type EditAttendanceInput = {
  student?: Maybe<Scalars['ID']>;
  group?: Maybe<Scalars['ID']>;
  date?: Maybe<Scalars['DateTime']>;
  published_at?: Maybe<Scalars['DateTime']>;
  created_by?: Maybe<Scalars['ID']>;
  updated_by?: Maybe<Scalars['ID']>;
};

export type CreateAttendanceInput = {
  data?: Maybe<AttendanceInput>;
};

export type CreateAttendancePayload = {
  __typename?: 'createAttendancePayload';
  attendance?: Maybe<Attendance>;
};

export type UpdateAttendanceInput = {
  where?: Maybe<InputId>;
  data?: Maybe<EditAttendanceInput>;
};

export type UpdateAttendancePayload = {
  __typename?: 'updateAttendancePayload';
  attendance?: Maybe<Attendance>;
};

export type DeleteAttendanceInput = {
  where?: Maybe<InputId>;
};

export type DeleteAttendancePayload = {
  __typename?: 'deleteAttendancePayload';
  attendance?: Maybe<Attendance>;
};

export type Group = {
  __typename?: 'Group';
  id: Scalars['ID'];
  created_at: Scalars['DateTime'];
  updated_at: Scalars['DateTime'];
  name: Scalars['String'];
  description?: Maybe<Scalars['String']>;
  teacher?: Maybe<Teacher>;
  published_at?: Maybe<Scalars['DateTime']>;
  students?: Maybe<Array<Maybe<Student>>>;
  attendances?: Maybe<Array<Maybe<Attendance>>>;
};


export type GroupStudentsArgs = {
  sort?: Maybe<Scalars['String']>;
  limit?: Maybe<Scalars['Int']>;
  start?: Maybe<Scalars['Int']>;
  where?: Maybe<Scalars['JSON']>;
};


export type GroupAttendancesArgs = {
  sort?: Maybe<Scalars['String']>;
  limit?: Maybe<Scalars['Int']>;
  start?: Maybe<Scalars['Int']>;
  where?: Maybe<Scalars['JSON']>;
};

export type GroupConnection = {
  __typename?: 'GroupConnection';
  values?: Maybe<Array<Maybe<Group>>>;
  groupBy?: Maybe<GroupGroupBy>;
  aggregate?: Maybe<GroupAggregator>;
};

export type GroupAggregator = {
  __typename?: 'GroupAggregator';
  count?: Maybe<Scalars['Int']>;
  totalCount?: Maybe<Scalars['Int']>;
};

export type GroupGroupBy = {
  __typename?: 'GroupGroupBy';
  id?: Maybe<Array<Maybe<GroupConnectionId>>>;
  created_at?: Maybe<Array<Maybe<GroupConnectionCreated_At>>>;
  updated_at?: Maybe<Array<Maybe<GroupConnectionUpdated_At>>>;
  name?: Maybe<Array<Maybe<GroupConnectionName>>>;
  description?: Maybe<Array<Maybe<GroupConnectionDescription>>>;
  teacher?: Maybe<Array<Maybe<GroupConnectionTeacher>>>;
  published_at?: Maybe<Array<Maybe<GroupConnectionPublished_At>>>;
};

export type GroupConnectionId = {
  __typename?: 'GroupConnectionId';
  key?: Maybe<Scalars['ID']>;
  connection?: Maybe<GroupConnection>;
};

export type GroupConnectionCreated_At = {
  __typename?: 'GroupConnectionCreated_at';
  key?: Maybe<Scalars['DateTime']>;
  connection?: Maybe<GroupConnection>;
};

export type GroupConnectionUpdated_At = {
  __typename?: 'GroupConnectionUpdated_at';
  key?: Maybe<Scalars['DateTime']>;
  connection?: Maybe<GroupConnection>;
};

export type GroupConnectionName = {
  __typename?: 'GroupConnectionName';
  key?: Maybe<Scalars['String']>;
  connection?: Maybe<GroupConnection>;
};

export type GroupConnectionDescription = {
  __typename?: 'GroupConnectionDescription';
  key?: Maybe<Scalars['String']>;
  connection?: Maybe<GroupConnection>;
};

export type GroupConnectionTeacher = {
  __typename?: 'GroupConnectionTeacher';
  key?: Maybe<Scalars['ID']>;
  connection?: Maybe<GroupConnection>;
};

export type GroupConnectionPublished_At = {
  __typename?: 'GroupConnectionPublished_at';
  key?: Maybe<Scalars['DateTime']>;
  connection?: Maybe<GroupConnection>;
};

export type GroupInput = {
  name: Scalars['String'];
  description?: Maybe<Scalars['String']>;
  teacher?: Maybe<Scalars['ID']>;
  students?: Maybe<Array<Maybe<Scalars['ID']>>>;
  attendances?: Maybe<Array<Maybe<Scalars['ID']>>>;
  published_at?: Maybe<Scalars['DateTime']>;
  created_by?: Maybe<Scalars['ID']>;
  updated_by?: Maybe<Scalars['ID']>;
};

export type EditGroupInput = {
  name?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
  teacher?: Maybe<Scalars['ID']>;
  students?: Maybe<Array<Maybe<Scalars['ID']>>>;
  attendances?: Maybe<Array<Maybe<Scalars['ID']>>>;
  published_at?: Maybe<Scalars['DateTime']>;
  created_by?: Maybe<Scalars['ID']>;
  updated_by?: Maybe<Scalars['ID']>;
};

export type CreateGroupInput = {
  data?: Maybe<GroupInput>;
};

export type CreateGroupPayload = {
  __typename?: 'createGroupPayload';
  group?: Maybe<Group>;
};

export type UpdateGroupInput = {
  where?: Maybe<InputId>;
  data?: Maybe<EditGroupInput>;
};

export type UpdateGroupPayload = {
  __typename?: 'updateGroupPayload';
  group?: Maybe<Group>;
};

export type DeleteGroupInput = {
  where?: Maybe<InputId>;
};

export type DeleteGroupPayload = {
  __typename?: 'deleteGroupPayload';
  group?: Maybe<Group>;
};

export type Student = {
  __typename?: 'Student';
  id: Scalars['ID'];
  created_at: Scalars['DateTime'];
  updated_at: Scalars['DateTime'];
  name: Scalars['String'];
  description?: Maybe<Scalars['String']>;
  published_at?: Maybe<Scalars['DateTime']>;
  groups?: Maybe<Array<Maybe<Group>>>;
  attendances?: Maybe<Array<Maybe<Attendance>>>;
};


export type StudentGroupsArgs = {
  sort?: Maybe<Scalars['String']>;
  limit?: Maybe<Scalars['Int']>;
  start?: Maybe<Scalars['Int']>;
  where?: Maybe<Scalars['JSON']>;
};


export type StudentAttendancesArgs = {
  sort?: Maybe<Scalars['String']>;
  limit?: Maybe<Scalars['Int']>;
  start?: Maybe<Scalars['Int']>;
  where?: Maybe<Scalars['JSON']>;
};

export type StudentConnection = {
  __typename?: 'StudentConnection';
  values?: Maybe<Array<Maybe<Student>>>;
  groupBy?: Maybe<StudentGroupBy>;
  aggregate?: Maybe<StudentAggregator>;
};

export type StudentAggregator = {
  __typename?: 'StudentAggregator';
  count?: Maybe<Scalars['Int']>;
  totalCount?: Maybe<Scalars['Int']>;
};

export type StudentGroupBy = {
  __typename?: 'StudentGroupBy';
  id?: Maybe<Array<Maybe<StudentConnectionId>>>;
  created_at?: Maybe<Array<Maybe<StudentConnectionCreated_At>>>;
  updated_at?: Maybe<Array<Maybe<StudentConnectionUpdated_At>>>;
  name?: Maybe<Array<Maybe<StudentConnectionName>>>;
  description?: Maybe<Array<Maybe<StudentConnectionDescription>>>;
  published_at?: Maybe<Array<Maybe<StudentConnectionPublished_At>>>;
};

export type StudentConnectionId = {
  __typename?: 'StudentConnectionId';
  key?: Maybe<Scalars['ID']>;
  connection?: Maybe<StudentConnection>;
};

export type StudentConnectionCreated_At = {
  __typename?: 'StudentConnectionCreated_at';
  key?: Maybe<Scalars['DateTime']>;
  connection?: Maybe<StudentConnection>;
};

export type StudentConnectionUpdated_At = {
  __typename?: 'StudentConnectionUpdated_at';
  key?: Maybe<Scalars['DateTime']>;
  connection?: Maybe<StudentConnection>;
};

export type StudentConnectionName = {
  __typename?: 'StudentConnectionName';
  key?: Maybe<Scalars['String']>;
  connection?: Maybe<StudentConnection>;
};

export type StudentConnectionDescription = {
  __typename?: 'StudentConnectionDescription';
  key?: Maybe<Scalars['String']>;
  connection?: Maybe<StudentConnection>;
};

export type StudentConnectionPublished_At = {
  __typename?: 'StudentConnectionPublished_at';
  key?: Maybe<Scalars['DateTime']>;
  connection?: Maybe<StudentConnection>;
};

export type StudentInput = {
  name: Scalars['String'];
  description?: Maybe<Scalars['String']>;
  groups?: Maybe<Array<Maybe<Scalars['ID']>>>;
  attendances?: Maybe<Array<Maybe<Scalars['ID']>>>;
  published_at?: Maybe<Scalars['DateTime']>;
  created_by?: Maybe<Scalars['ID']>;
  updated_by?: Maybe<Scalars['ID']>;
};

export type EditStudentInput = {
  name?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
  groups?: Maybe<Array<Maybe<Scalars['ID']>>>;
  attendances?: Maybe<Array<Maybe<Scalars['ID']>>>;
  published_at?: Maybe<Scalars['DateTime']>;
  created_by?: Maybe<Scalars['ID']>;
  updated_by?: Maybe<Scalars['ID']>;
};

export type CreateStudentInput = {
  data?: Maybe<StudentInput>;
};

export type CreateStudentPayload = {
  __typename?: 'createStudentPayload';
  student?: Maybe<Student>;
};

export type UpdateStudentInput = {
  where?: Maybe<InputId>;
  data?: Maybe<EditStudentInput>;
};

export type UpdateStudentPayload = {
  __typename?: 'updateStudentPayload';
  student?: Maybe<Student>;
};

export type DeleteStudentInput = {
  where?: Maybe<InputId>;
};

export type DeleteStudentPayload = {
  __typename?: 'deleteStudentPayload';
  student?: Maybe<Student>;
};

export type Teacher = {
  __typename?: 'Teacher';
  id: Scalars['ID'];
  created_at: Scalars['DateTime'];
  updated_at: Scalars['DateTime'];
  name: Scalars['String'];
  avatar?: Maybe<UploadFile>;
  description?: Maybe<Scalars['String']>;
  published_at?: Maybe<Scalars['DateTime']>;
  groups?: Maybe<Array<Maybe<Group>>>;
};


export type TeacherGroupsArgs = {
  sort?: Maybe<Scalars['String']>;
  limit?: Maybe<Scalars['Int']>;
  start?: Maybe<Scalars['Int']>;
  where?: Maybe<Scalars['JSON']>;
};

export type TeacherConnection = {
  __typename?: 'TeacherConnection';
  values?: Maybe<Array<Maybe<Teacher>>>;
  groupBy?: Maybe<TeacherGroupBy>;
  aggregate?: Maybe<TeacherAggregator>;
};

export type TeacherAggregator = {
  __typename?: 'TeacherAggregator';
  count?: Maybe<Scalars['Int']>;
  totalCount?: Maybe<Scalars['Int']>;
};

export type TeacherGroupBy = {
  __typename?: 'TeacherGroupBy';
  id?: Maybe<Array<Maybe<TeacherConnectionId>>>;
  created_at?: Maybe<Array<Maybe<TeacherConnectionCreated_At>>>;
  updated_at?: Maybe<Array<Maybe<TeacherConnectionUpdated_At>>>;
  name?: Maybe<Array<Maybe<TeacherConnectionName>>>;
  avatar?: Maybe<Array<Maybe<TeacherConnectionAvatar>>>;
  description?: Maybe<Array<Maybe<TeacherConnectionDescription>>>;
  published_at?: Maybe<Array<Maybe<TeacherConnectionPublished_At>>>;
};

export type TeacherConnectionId = {
  __typename?: 'TeacherConnectionId';
  key?: Maybe<Scalars['ID']>;
  connection?: Maybe<TeacherConnection>;
};

export type TeacherConnectionCreated_At = {
  __typename?: 'TeacherConnectionCreated_at';
  key?: Maybe<Scalars['DateTime']>;
  connection?: Maybe<TeacherConnection>;
};

export type TeacherConnectionUpdated_At = {
  __typename?: 'TeacherConnectionUpdated_at';
  key?: Maybe<Scalars['DateTime']>;
  connection?: Maybe<TeacherConnection>;
};

export type TeacherConnectionName = {
  __typename?: 'TeacherConnectionName';
  key?: Maybe<Scalars['String']>;
  connection?: Maybe<TeacherConnection>;
};

export type TeacherConnectionAvatar = {
  __typename?: 'TeacherConnectionAvatar';
  key?: Maybe<Scalars['ID']>;
  connection?: Maybe<TeacherConnection>;
};

export type TeacherConnectionDescription = {
  __typename?: 'TeacherConnectionDescription';
  key?: Maybe<Scalars['String']>;
  connection?: Maybe<TeacherConnection>;
};

export type TeacherConnectionPublished_At = {
  __typename?: 'TeacherConnectionPublished_at';
  key?: Maybe<Scalars['DateTime']>;
  connection?: Maybe<TeacherConnection>;
};

export type TeacherInput = {
  name: Scalars['String'];
  avatar?: Maybe<Scalars['ID']>;
  description?: Maybe<Scalars['String']>;
  groups?: Maybe<Array<Maybe<Scalars['ID']>>>;
  published_at?: Maybe<Scalars['DateTime']>;
  created_by?: Maybe<Scalars['ID']>;
  updated_by?: Maybe<Scalars['ID']>;
};

export type EditTeacherInput = {
  name?: Maybe<Scalars['String']>;
  avatar?: Maybe<Scalars['ID']>;
  description?: Maybe<Scalars['String']>;
  groups?: Maybe<Array<Maybe<Scalars['ID']>>>;
  published_at?: Maybe<Scalars['DateTime']>;
  created_by?: Maybe<Scalars['ID']>;
  updated_by?: Maybe<Scalars['ID']>;
};

export type CreateTeacherInput = {
  data?: Maybe<TeacherInput>;
};

export type CreateTeacherPayload = {
  __typename?: 'createTeacherPayload';
  teacher?: Maybe<Teacher>;
};

export type UpdateTeacherInput = {
  where?: Maybe<InputId>;
  data?: Maybe<EditTeacherInput>;
};

export type UpdateTeacherPayload = {
  __typename?: 'updateTeacherPayload';
  teacher?: Maybe<Teacher>;
};

export type DeleteTeacherInput = {
  where?: Maybe<InputId>;
};

export type DeleteTeacherPayload = {
  __typename?: 'deleteTeacherPayload';
  teacher?: Maybe<Teacher>;
};

export type UploadFile = {
  __typename?: 'UploadFile';
  id: Scalars['ID'];
  created_at: Scalars['DateTime'];
  updated_at: Scalars['DateTime'];
  name: Scalars['String'];
  alternativeText?: Maybe<Scalars['String']>;
  caption?: Maybe<Scalars['String']>;
  width?: Maybe<Scalars['Int']>;
  height?: Maybe<Scalars['Int']>;
  formats?: Maybe<Scalars['JSON']>;
  hash: Scalars['String'];
  ext?: Maybe<Scalars['String']>;
  mime: Scalars['String'];
  size: Scalars['Float'];
  url: Scalars['String'];
  previewUrl?: Maybe<Scalars['String']>;
  provider: Scalars['String'];
  provider_metadata?: Maybe<Scalars['JSON']>;
  related?: Maybe<Array<Maybe<Morph>>>;
};


export type UploadFileRelatedArgs = {
  sort?: Maybe<Scalars['String']>;
  limit?: Maybe<Scalars['Int']>;
  start?: Maybe<Scalars['Int']>;
  where?: Maybe<Scalars['JSON']>;
};

export type UploadFileConnection = {
  __typename?: 'UploadFileConnection';
  values?: Maybe<Array<Maybe<UploadFile>>>;
  groupBy?: Maybe<UploadFileGroupBy>;
  aggregate?: Maybe<UploadFileAggregator>;
};

export type UploadFileAggregator = {
  __typename?: 'UploadFileAggregator';
  count?: Maybe<Scalars['Int']>;
  totalCount?: Maybe<Scalars['Int']>;
  sum?: Maybe<UploadFileAggregatorSum>;
  avg?: Maybe<UploadFileAggregatorAvg>;
  min?: Maybe<UploadFileAggregatorMin>;
  max?: Maybe<UploadFileAggregatorMax>;
};

export type UploadFileAggregatorSum = {
  __typename?: 'UploadFileAggregatorSum';
  width?: Maybe<Scalars['Float']>;
  height?: Maybe<Scalars['Float']>;
  size?: Maybe<Scalars['Float']>;
};

export type UploadFileAggregatorAvg = {
  __typename?: 'UploadFileAggregatorAvg';
  width?: Maybe<Scalars['Float']>;
  height?: Maybe<Scalars['Float']>;
  size?: Maybe<Scalars['Float']>;
};

export type UploadFileAggregatorMin = {
  __typename?: 'UploadFileAggregatorMin';
  width?: Maybe<Scalars['Float']>;
  height?: Maybe<Scalars['Float']>;
  size?: Maybe<Scalars['Float']>;
};

export type UploadFileAggregatorMax = {
  __typename?: 'UploadFileAggregatorMax';
  width?: Maybe<Scalars['Float']>;
  height?: Maybe<Scalars['Float']>;
  size?: Maybe<Scalars['Float']>;
};

export type UploadFileGroupBy = {
  __typename?: 'UploadFileGroupBy';
  id?: Maybe<Array<Maybe<UploadFileConnectionId>>>;
  created_at?: Maybe<Array<Maybe<UploadFileConnectionCreated_At>>>;
  updated_at?: Maybe<Array<Maybe<UploadFileConnectionUpdated_At>>>;
  name?: Maybe<Array<Maybe<UploadFileConnectionName>>>;
  alternativeText?: Maybe<Array<Maybe<UploadFileConnectionAlternativeText>>>;
  caption?: Maybe<Array<Maybe<UploadFileConnectionCaption>>>;
  width?: Maybe<Array<Maybe<UploadFileConnectionWidth>>>;
  height?: Maybe<Array<Maybe<UploadFileConnectionHeight>>>;
  formats?: Maybe<Array<Maybe<UploadFileConnectionFormats>>>;
  hash?: Maybe<Array<Maybe<UploadFileConnectionHash>>>;
  ext?: Maybe<Array<Maybe<UploadFileConnectionExt>>>;
  mime?: Maybe<Array<Maybe<UploadFileConnectionMime>>>;
  size?: Maybe<Array<Maybe<UploadFileConnectionSize>>>;
  url?: Maybe<Array<Maybe<UploadFileConnectionUrl>>>;
  previewUrl?: Maybe<Array<Maybe<UploadFileConnectionPreviewUrl>>>;
  provider?: Maybe<Array<Maybe<UploadFileConnectionProvider>>>;
  provider_metadata?: Maybe<Array<Maybe<UploadFileConnectionProvider_Metadata>>>;
};

export type UploadFileConnectionId = {
  __typename?: 'UploadFileConnectionId';
  key?: Maybe<Scalars['ID']>;
  connection?: Maybe<UploadFileConnection>;
};

export type UploadFileConnectionCreated_At = {
  __typename?: 'UploadFileConnectionCreated_at';
  key?: Maybe<Scalars['DateTime']>;
  connection?: Maybe<UploadFileConnection>;
};

export type UploadFileConnectionUpdated_At = {
  __typename?: 'UploadFileConnectionUpdated_at';
  key?: Maybe<Scalars['DateTime']>;
  connection?: Maybe<UploadFileConnection>;
};

export type UploadFileConnectionName = {
  __typename?: 'UploadFileConnectionName';
  key?: Maybe<Scalars['String']>;
  connection?: Maybe<UploadFileConnection>;
};

export type UploadFileConnectionAlternativeText = {
  __typename?: 'UploadFileConnectionAlternativeText';
  key?: Maybe<Scalars['String']>;
  connection?: Maybe<UploadFileConnection>;
};

export type UploadFileConnectionCaption = {
  __typename?: 'UploadFileConnectionCaption';
  key?: Maybe<Scalars['String']>;
  connection?: Maybe<UploadFileConnection>;
};

export type UploadFileConnectionWidth = {
  __typename?: 'UploadFileConnectionWidth';
  key?: Maybe<Scalars['Int']>;
  connection?: Maybe<UploadFileConnection>;
};

export type UploadFileConnectionHeight = {
  __typename?: 'UploadFileConnectionHeight';
  key?: Maybe<Scalars['Int']>;
  connection?: Maybe<UploadFileConnection>;
};

export type UploadFileConnectionFormats = {
  __typename?: 'UploadFileConnectionFormats';
  key?: Maybe<Scalars['JSON']>;
  connection?: Maybe<UploadFileConnection>;
};

export type UploadFileConnectionHash = {
  __typename?: 'UploadFileConnectionHash';
  key?: Maybe<Scalars['String']>;
  connection?: Maybe<UploadFileConnection>;
};

export type UploadFileConnectionExt = {
  __typename?: 'UploadFileConnectionExt';
  key?: Maybe<Scalars['String']>;
  connection?: Maybe<UploadFileConnection>;
};

export type UploadFileConnectionMime = {
  __typename?: 'UploadFileConnectionMime';
  key?: Maybe<Scalars['String']>;
  connection?: Maybe<UploadFileConnection>;
};

export type UploadFileConnectionSize = {
  __typename?: 'UploadFileConnectionSize';
  key?: Maybe<Scalars['Float']>;
  connection?: Maybe<UploadFileConnection>;
};

export type UploadFileConnectionUrl = {
  __typename?: 'UploadFileConnectionUrl';
  key?: Maybe<Scalars['String']>;
  connection?: Maybe<UploadFileConnection>;
};

export type UploadFileConnectionPreviewUrl = {
  __typename?: 'UploadFileConnectionPreviewUrl';
  key?: Maybe<Scalars['String']>;
  connection?: Maybe<UploadFileConnection>;
};

export type UploadFileConnectionProvider = {
  __typename?: 'UploadFileConnectionProvider';
  key?: Maybe<Scalars['String']>;
  connection?: Maybe<UploadFileConnection>;
};

export type UploadFileConnectionProvider_Metadata = {
  __typename?: 'UploadFileConnectionProvider_metadata';
  key?: Maybe<Scalars['JSON']>;
  connection?: Maybe<UploadFileConnection>;
};

export type FileInput = {
  name: Scalars['String'];
  alternativeText?: Maybe<Scalars['String']>;
  caption?: Maybe<Scalars['String']>;
  width?: Maybe<Scalars['Int']>;
  height?: Maybe<Scalars['Int']>;
  formats?: Maybe<Scalars['JSON']>;
  hash: Scalars['String'];
  ext?: Maybe<Scalars['String']>;
  mime: Scalars['String'];
  size: Scalars['Float'];
  url: Scalars['String'];
  previewUrl?: Maybe<Scalars['String']>;
  provider: Scalars['String'];
  provider_metadata?: Maybe<Scalars['JSON']>;
  related?: Maybe<Array<Maybe<Scalars['ID']>>>;
  created_by?: Maybe<Scalars['ID']>;
  updated_by?: Maybe<Scalars['ID']>;
};

export type EditFileInput = {
  name?: Maybe<Scalars['String']>;
  alternativeText?: Maybe<Scalars['String']>;
  caption?: Maybe<Scalars['String']>;
  width?: Maybe<Scalars['Int']>;
  height?: Maybe<Scalars['Int']>;
  formats?: Maybe<Scalars['JSON']>;
  hash?: Maybe<Scalars['String']>;
  ext?: Maybe<Scalars['String']>;
  mime?: Maybe<Scalars['String']>;
  size?: Maybe<Scalars['Float']>;
  url?: Maybe<Scalars['String']>;
  previewUrl?: Maybe<Scalars['String']>;
  provider?: Maybe<Scalars['String']>;
  provider_metadata?: Maybe<Scalars['JSON']>;
  related?: Maybe<Array<Maybe<Scalars['ID']>>>;
  created_by?: Maybe<Scalars['ID']>;
  updated_by?: Maybe<Scalars['ID']>;
};

export type DeleteFileInput = {
  where?: Maybe<InputId>;
};

export type DeleteFilePayload = {
  __typename?: 'deleteFilePayload';
  file?: Maybe<UploadFile>;
};

export type UsersPermissionsPermission = {
  __typename?: 'UsersPermissionsPermission';
  id: Scalars['ID'];
  type: Scalars['String'];
  controller: Scalars['String'];
  action: Scalars['String'];
  enabled: Scalars['Boolean'];
  policy?: Maybe<Scalars['String']>;
  role?: Maybe<UsersPermissionsRole>;
};

export type UsersPermissionsRole = {
  __typename?: 'UsersPermissionsRole';
  id: Scalars['ID'];
  name: Scalars['String'];
  description?: Maybe<Scalars['String']>;
  type?: Maybe<Scalars['String']>;
  permissions?: Maybe<Array<Maybe<UsersPermissionsPermission>>>;
  users?: Maybe<Array<Maybe<UsersPermissionsUser>>>;
};


export type UsersPermissionsRolePermissionsArgs = {
  sort?: Maybe<Scalars['String']>;
  limit?: Maybe<Scalars['Int']>;
  start?: Maybe<Scalars['Int']>;
  where?: Maybe<Scalars['JSON']>;
};


export type UsersPermissionsRoleUsersArgs = {
  sort?: Maybe<Scalars['String']>;
  limit?: Maybe<Scalars['Int']>;
  start?: Maybe<Scalars['Int']>;
  where?: Maybe<Scalars['JSON']>;
};

export type UsersPermissionsRoleConnection = {
  __typename?: 'UsersPermissionsRoleConnection';
  values?: Maybe<Array<Maybe<UsersPermissionsRole>>>;
  groupBy?: Maybe<UsersPermissionsRoleGroupBy>;
  aggregate?: Maybe<UsersPermissionsRoleAggregator>;
};

export type UsersPermissionsRoleAggregator = {
  __typename?: 'UsersPermissionsRoleAggregator';
  count?: Maybe<Scalars['Int']>;
  totalCount?: Maybe<Scalars['Int']>;
};

export type UsersPermissionsRoleGroupBy = {
  __typename?: 'UsersPermissionsRoleGroupBy';
  id?: Maybe<Array<Maybe<UsersPermissionsRoleConnectionId>>>;
  name?: Maybe<Array<Maybe<UsersPermissionsRoleConnectionName>>>;
  description?: Maybe<Array<Maybe<UsersPermissionsRoleConnectionDescription>>>;
  type?: Maybe<Array<Maybe<UsersPermissionsRoleConnectionType>>>;
};

export type UsersPermissionsRoleConnectionId = {
  __typename?: 'UsersPermissionsRoleConnectionId';
  key?: Maybe<Scalars['ID']>;
  connection?: Maybe<UsersPermissionsRoleConnection>;
};

export type UsersPermissionsRoleConnectionName = {
  __typename?: 'UsersPermissionsRoleConnectionName';
  key?: Maybe<Scalars['String']>;
  connection?: Maybe<UsersPermissionsRoleConnection>;
};

export type UsersPermissionsRoleConnectionDescription = {
  __typename?: 'UsersPermissionsRoleConnectionDescription';
  key?: Maybe<Scalars['String']>;
  connection?: Maybe<UsersPermissionsRoleConnection>;
};

export type UsersPermissionsRoleConnectionType = {
  __typename?: 'UsersPermissionsRoleConnectionType';
  key?: Maybe<Scalars['String']>;
  connection?: Maybe<UsersPermissionsRoleConnection>;
};

export type RoleInput = {
  name: Scalars['String'];
  description?: Maybe<Scalars['String']>;
  type?: Maybe<Scalars['String']>;
  permissions?: Maybe<Array<Maybe<Scalars['ID']>>>;
  users?: Maybe<Array<Maybe<Scalars['ID']>>>;
  created_by?: Maybe<Scalars['ID']>;
  updated_by?: Maybe<Scalars['ID']>;
};

export type EditRoleInput = {
  name?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
  type?: Maybe<Scalars['String']>;
  permissions?: Maybe<Array<Maybe<Scalars['ID']>>>;
  users?: Maybe<Array<Maybe<Scalars['ID']>>>;
  created_by?: Maybe<Scalars['ID']>;
  updated_by?: Maybe<Scalars['ID']>;
};

export type CreateRoleInput = {
  data?: Maybe<RoleInput>;
};

export type CreateRolePayload = {
  __typename?: 'createRolePayload';
  role?: Maybe<UsersPermissionsRole>;
};

export type UpdateRoleInput = {
  where?: Maybe<InputId>;
  data?: Maybe<EditRoleInput>;
};

export type UpdateRolePayload = {
  __typename?: 'updateRolePayload';
  role?: Maybe<UsersPermissionsRole>;
};

export type DeleteRoleInput = {
  where?: Maybe<InputId>;
};

export type DeleteRolePayload = {
  __typename?: 'deleteRolePayload';
  role?: Maybe<UsersPermissionsRole>;
};

export type UsersPermissionsUser = {
  __typename?: 'UsersPermissionsUser';
  id: Scalars['ID'];
  created_at: Scalars['DateTime'];
  updated_at: Scalars['DateTime'];
  username: Scalars['String'];
  email: Scalars['String'];
  provider?: Maybe<Scalars['String']>;
  confirmed?: Maybe<Scalars['Boolean']>;
  blocked?: Maybe<Scalars['Boolean']>;
  role?: Maybe<UsersPermissionsRole>;
};

export type UsersPermissionsUserConnection = {
  __typename?: 'UsersPermissionsUserConnection';
  values?: Maybe<Array<Maybe<UsersPermissionsUser>>>;
  groupBy?: Maybe<UsersPermissionsUserGroupBy>;
  aggregate?: Maybe<UsersPermissionsUserAggregator>;
};

export type UsersPermissionsUserAggregator = {
  __typename?: 'UsersPermissionsUserAggregator';
  count?: Maybe<Scalars['Int']>;
  totalCount?: Maybe<Scalars['Int']>;
};

export type UsersPermissionsUserGroupBy = {
  __typename?: 'UsersPermissionsUserGroupBy';
  id?: Maybe<Array<Maybe<UsersPermissionsUserConnectionId>>>;
  created_at?: Maybe<Array<Maybe<UsersPermissionsUserConnectionCreated_At>>>;
  updated_at?: Maybe<Array<Maybe<UsersPermissionsUserConnectionUpdated_At>>>;
  username?: Maybe<Array<Maybe<UsersPermissionsUserConnectionUsername>>>;
  email?: Maybe<Array<Maybe<UsersPermissionsUserConnectionEmail>>>;
  provider?: Maybe<Array<Maybe<UsersPermissionsUserConnectionProvider>>>;
  confirmed?: Maybe<Array<Maybe<UsersPermissionsUserConnectionConfirmed>>>;
  blocked?: Maybe<Array<Maybe<UsersPermissionsUserConnectionBlocked>>>;
  role?: Maybe<Array<Maybe<UsersPermissionsUserConnectionRole>>>;
};

export type UsersPermissionsUserConnectionId = {
  __typename?: 'UsersPermissionsUserConnectionId';
  key?: Maybe<Scalars['ID']>;
  connection?: Maybe<UsersPermissionsUserConnection>;
};

export type UsersPermissionsUserConnectionCreated_At = {
  __typename?: 'UsersPermissionsUserConnectionCreated_at';
  key?: Maybe<Scalars['DateTime']>;
  connection?: Maybe<UsersPermissionsUserConnection>;
};

export type UsersPermissionsUserConnectionUpdated_At = {
  __typename?: 'UsersPermissionsUserConnectionUpdated_at';
  key?: Maybe<Scalars['DateTime']>;
  connection?: Maybe<UsersPermissionsUserConnection>;
};

export type UsersPermissionsUserConnectionUsername = {
  __typename?: 'UsersPermissionsUserConnectionUsername';
  key?: Maybe<Scalars['String']>;
  connection?: Maybe<UsersPermissionsUserConnection>;
};

export type UsersPermissionsUserConnectionEmail = {
  __typename?: 'UsersPermissionsUserConnectionEmail';
  key?: Maybe<Scalars['String']>;
  connection?: Maybe<UsersPermissionsUserConnection>;
};

export type UsersPermissionsUserConnectionProvider = {
  __typename?: 'UsersPermissionsUserConnectionProvider';
  key?: Maybe<Scalars['String']>;
  connection?: Maybe<UsersPermissionsUserConnection>;
};

export type UsersPermissionsUserConnectionConfirmed = {
  __typename?: 'UsersPermissionsUserConnectionConfirmed';
  key?: Maybe<Scalars['Boolean']>;
  connection?: Maybe<UsersPermissionsUserConnection>;
};

export type UsersPermissionsUserConnectionBlocked = {
  __typename?: 'UsersPermissionsUserConnectionBlocked';
  key?: Maybe<Scalars['Boolean']>;
  connection?: Maybe<UsersPermissionsUserConnection>;
};

export type UsersPermissionsUserConnectionRole = {
  __typename?: 'UsersPermissionsUserConnectionRole';
  key?: Maybe<Scalars['ID']>;
  connection?: Maybe<UsersPermissionsUserConnection>;
};

export type UserInput = {
  username: Scalars['String'];
  email: Scalars['String'];
  provider?: Maybe<Scalars['String']>;
  password?: Maybe<Scalars['String']>;
  resetPasswordToken?: Maybe<Scalars['String']>;
  confirmationToken?: Maybe<Scalars['String']>;
  confirmed?: Maybe<Scalars['Boolean']>;
  blocked?: Maybe<Scalars['Boolean']>;
  role?: Maybe<Scalars['ID']>;
  created_by?: Maybe<Scalars['ID']>;
  updated_by?: Maybe<Scalars['ID']>;
};

export type EditUserInput = {
  username?: Maybe<Scalars['String']>;
  email?: Maybe<Scalars['String']>;
  provider?: Maybe<Scalars['String']>;
  password?: Maybe<Scalars['String']>;
  resetPasswordToken?: Maybe<Scalars['String']>;
  confirmationToken?: Maybe<Scalars['String']>;
  confirmed?: Maybe<Scalars['Boolean']>;
  blocked?: Maybe<Scalars['Boolean']>;
  role?: Maybe<Scalars['ID']>;
  created_by?: Maybe<Scalars['ID']>;
  updated_by?: Maybe<Scalars['ID']>;
};

export type CreateUserInput = {
  data?: Maybe<UserInput>;
};

export type CreateUserPayload = {
  __typename?: 'createUserPayload';
  user?: Maybe<UsersPermissionsUser>;
};

export type UpdateUserInput = {
  where?: Maybe<InputId>;
  data?: Maybe<EditUserInput>;
};

export type UpdateUserPayload = {
  __typename?: 'updateUserPayload';
  user?: Maybe<UsersPermissionsUser>;
};

export type DeleteUserInput = {
  where?: Maybe<InputId>;
};

export type DeleteUserPayload = {
  __typename?: 'deleteUserPayload';
  user?: Maybe<UsersPermissionsUser>;
};

export type Morph = UsersPermissionsMe | UsersPermissionsMeRole | UsersPermissionsLoginPayload | UserPermissionsPasswordPayload | Attendance | AttendanceConnection | AttendanceAggregator | AttendanceGroupBy | AttendanceConnectionId | AttendanceConnectionCreated_At | AttendanceConnectionUpdated_At | AttendanceConnectionStudent | AttendanceConnectionGroup | AttendanceConnectionDate | AttendanceConnectionPublished_At | CreateAttendancePayload | UpdateAttendancePayload | DeleteAttendancePayload | Group | GroupConnection | GroupAggregator | GroupGroupBy | GroupConnectionId | GroupConnectionCreated_At | GroupConnectionUpdated_At | GroupConnectionName | GroupConnectionDescription | GroupConnectionTeacher | GroupConnectionPublished_At | CreateGroupPayload | UpdateGroupPayload | DeleteGroupPayload | Student | StudentConnection | StudentAggregator | StudentGroupBy | StudentConnectionId | StudentConnectionCreated_At | StudentConnectionUpdated_At | StudentConnectionName | StudentConnectionDescription | StudentConnectionPublished_At | CreateStudentPayload | UpdateStudentPayload | DeleteStudentPayload | Teacher | TeacherConnection | TeacherAggregator | TeacherGroupBy | TeacherConnectionId | TeacherConnectionCreated_At | TeacherConnectionUpdated_At | TeacherConnectionName | TeacherConnectionAvatar | TeacherConnectionDescription | TeacherConnectionPublished_At | CreateTeacherPayload | UpdateTeacherPayload | DeleteTeacherPayload | UploadFile | UploadFileConnection | UploadFileAggregator | UploadFileAggregatorSum | UploadFileAggregatorAvg | UploadFileAggregatorMin | UploadFileAggregatorMax | UploadFileGroupBy | UploadFileConnectionId | UploadFileConnectionCreated_At | UploadFileConnectionUpdated_At | UploadFileConnectionName | UploadFileConnectionAlternativeText | UploadFileConnectionCaption | UploadFileConnectionWidth | UploadFileConnectionHeight | UploadFileConnectionFormats | UploadFileConnectionHash | UploadFileConnectionExt | UploadFileConnectionMime | UploadFileConnectionSize | UploadFileConnectionUrl | UploadFileConnectionPreviewUrl | UploadFileConnectionProvider | UploadFileConnectionProvider_Metadata | DeleteFilePayload | UsersPermissionsPermission | UsersPermissionsRole | UsersPermissionsRoleConnection | UsersPermissionsRoleAggregator | UsersPermissionsRoleGroupBy | UsersPermissionsRoleConnectionId | UsersPermissionsRoleConnectionName | UsersPermissionsRoleConnectionDescription | UsersPermissionsRoleConnectionType | CreateRolePayload | UpdateRolePayload | DeleteRolePayload | UsersPermissionsUser | UsersPermissionsUserConnection | UsersPermissionsUserAggregator | UsersPermissionsUserGroupBy | UsersPermissionsUserConnectionId | UsersPermissionsUserConnectionCreated_At | UsersPermissionsUserConnectionUpdated_At | UsersPermissionsUserConnectionUsername | UsersPermissionsUserConnectionEmail | UsersPermissionsUserConnectionProvider | UsersPermissionsUserConnectionConfirmed | UsersPermissionsUserConnectionBlocked | UsersPermissionsUserConnectionRole | CreateUserPayload | UpdateUserPayload | DeleteUserPayload;

export type InputId = {
  id: Scalars['ID'];
};

export enum PublicationState {
  Live = 'LIVE',
  Preview = 'PREVIEW'
}

export type AdminUser = {
  __typename?: 'AdminUser';
  id: Scalars['ID'];
  username?: Maybe<Scalars['String']>;
  firstname: Scalars['String'];
  lastname: Scalars['String'];
};

export type Query = {
  __typename?: 'Query';
  attendance?: Maybe<Attendance>;
  attendances?: Maybe<Array<Maybe<Attendance>>>;
  attendancesConnection?: Maybe<AttendanceConnection>;
  group?: Maybe<Group>;
  groups?: Maybe<Array<Maybe<Group>>>;
  groupsConnection?: Maybe<GroupConnection>;
  student?: Maybe<Student>;
  students?: Maybe<Array<Maybe<Student>>>;
  studentsConnection?: Maybe<StudentConnection>;
  teacher?: Maybe<Teacher>;
  teachers?: Maybe<Array<Maybe<Teacher>>>;
  teachersConnection?: Maybe<TeacherConnection>;
  files?: Maybe<Array<Maybe<UploadFile>>>;
  filesConnection?: Maybe<UploadFileConnection>;
  role?: Maybe<UsersPermissionsRole>;
  /** Retrieve all the existing roles. You can't apply filters on this query. */
  roles?: Maybe<Array<Maybe<UsersPermissionsRole>>>;
  rolesConnection?: Maybe<UsersPermissionsRoleConnection>;
  user?: Maybe<UsersPermissionsUser>;
  users?: Maybe<Array<Maybe<UsersPermissionsUser>>>;
  usersConnection?: Maybe<UsersPermissionsUserConnection>;
  me?: Maybe<UsersPermissionsMe>;
};


export type QueryAttendanceArgs = {
  id: Scalars['ID'];
  publicationState?: Maybe<PublicationState>;
};


export type QueryAttendancesArgs = {
  sort?: Maybe<Scalars['String']>;
  limit?: Maybe<Scalars['Int']>;
  start?: Maybe<Scalars['Int']>;
  where?: Maybe<Scalars['JSON']>;
  publicationState?: Maybe<PublicationState>;
};


export type QueryAttendancesConnectionArgs = {
  sort?: Maybe<Scalars['String']>;
  limit?: Maybe<Scalars['Int']>;
  start?: Maybe<Scalars['Int']>;
  where?: Maybe<Scalars['JSON']>;
};


export type QueryGroupArgs = {
  id: Scalars['ID'];
  publicationState?: Maybe<PublicationState>;
};


export type QueryGroupsArgs = {
  sort?: Maybe<Scalars['String']>;
  limit?: Maybe<Scalars['Int']>;
  start?: Maybe<Scalars['Int']>;
  where?: Maybe<Scalars['JSON']>;
  publicationState?: Maybe<PublicationState>;
};


export type QueryGroupsConnectionArgs = {
  sort?: Maybe<Scalars['String']>;
  limit?: Maybe<Scalars['Int']>;
  start?: Maybe<Scalars['Int']>;
  where?: Maybe<Scalars['JSON']>;
};


export type QueryStudentArgs = {
  id: Scalars['ID'];
  publicationState?: Maybe<PublicationState>;
};


export type QueryStudentsArgs = {
  sort?: Maybe<Scalars['String']>;
  limit?: Maybe<Scalars['Int']>;
  start?: Maybe<Scalars['Int']>;
  where?: Maybe<Scalars['JSON']>;
  publicationState?: Maybe<PublicationState>;
};


export type QueryStudentsConnectionArgs = {
  sort?: Maybe<Scalars['String']>;
  limit?: Maybe<Scalars['Int']>;
  start?: Maybe<Scalars['Int']>;
  where?: Maybe<Scalars['JSON']>;
};


export type QueryTeacherArgs = {
  id: Scalars['ID'];
  publicationState?: Maybe<PublicationState>;
};


export type QueryTeachersArgs = {
  sort?: Maybe<Scalars['String']>;
  limit?: Maybe<Scalars['Int']>;
  start?: Maybe<Scalars['Int']>;
  where?: Maybe<Scalars['JSON']>;
  publicationState?: Maybe<PublicationState>;
};


export type QueryTeachersConnectionArgs = {
  sort?: Maybe<Scalars['String']>;
  limit?: Maybe<Scalars['Int']>;
  start?: Maybe<Scalars['Int']>;
  where?: Maybe<Scalars['JSON']>;
};


export type QueryFilesArgs = {
  sort?: Maybe<Scalars['String']>;
  limit?: Maybe<Scalars['Int']>;
  start?: Maybe<Scalars['Int']>;
  where?: Maybe<Scalars['JSON']>;
  publicationState?: Maybe<PublicationState>;
};


export type QueryFilesConnectionArgs = {
  sort?: Maybe<Scalars['String']>;
  limit?: Maybe<Scalars['Int']>;
  start?: Maybe<Scalars['Int']>;
  where?: Maybe<Scalars['JSON']>;
};


export type QueryRoleArgs = {
  id: Scalars['ID'];
  publicationState?: Maybe<PublicationState>;
};


export type QueryRolesArgs = {
  sort?: Maybe<Scalars['String']>;
  limit?: Maybe<Scalars['Int']>;
  start?: Maybe<Scalars['Int']>;
  where?: Maybe<Scalars['JSON']>;
  publicationState?: Maybe<PublicationState>;
};


export type QueryRolesConnectionArgs = {
  sort?: Maybe<Scalars['String']>;
  limit?: Maybe<Scalars['Int']>;
  start?: Maybe<Scalars['Int']>;
  where?: Maybe<Scalars['JSON']>;
};


export type QueryUserArgs = {
  id: Scalars['ID'];
  publicationState?: Maybe<PublicationState>;
};


export type QueryUsersArgs = {
  sort?: Maybe<Scalars['String']>;
  limit?: Maybe<Scalars['Int']>;
  start?: Maybe<Scalars['Int']>;
  where?: Maybe<Scalars['JSON']>;
  publicationState?: Maybe<PublicationState>;
};


export type QueryUsersConnectionArgs = {
  sort?: Maybe<Scalars['String']>;
  limit?: Maybe<Scalars['Int']>;
  start?: Maybe<Scalars['Int']>;
  where?: Maybe<Scalars['JSON']>;
};

export type Mutation = {
  __typename?: 'Mutation';
  createAttendance?: Maybe<CreateAttendancePayload>;
  updateAttendance?: Maybe<UpdateAttendancePayload>;
  deleteAttendance?: Maybe<DeleteAttendancePayload>;
  createGroup?: Maybe<CreateGroupPayload>;
  updateGroup?: Maybe<UpdateGroupPayload>;
  deleteGroup?: Maybe<DeleteGroupPayload>;
  createStudent?: Maybe<CreateStudentPayload>;
  updateStudent?: Maybe<UpdateStudentPayload>;
  deleteStudent?: Maybe<DeleteStudentPayload>;
  createTeacher?: Maybe<CreateTeacherPayload>;
  updateTeacher?: Maybe<UpdateTeacherPayload>;
  deleteTeacher?: Maybe<DeleteTeacherPayload>;
  /** Delete one file */
  deleteFile?: Maybe<DeleteFilePayload>;
  /** Create a new role */
  createRole?: Maybe<CreateRolePayload>;
  /** Update an existing role */
  updateRole?: Maybe<UpdateRolePayload>;
  /** Delete an existing role */
  deleteRole?: Maybe<DeleteRolePayload>;
  /** Create a new user */
  createUser?: Maybe<CreateUserPayload>;
  /** Update an existing user */
  updateUser?: Maybe<UpdateUserPayload>;
  /** Delete an existing user */
  deleteUser?: Maybe<DeleteUserPayload>;
  upload: UploadFile;
  multipleUpload: Array<Maybe<UploadFile>>;
  updateFileInfo: UploadFile;
  login: UsersPermissionsLoginPayload;
  register: UsersPermissionsLoginPayload;
  forgotPassword?: Maybe<UserPermissionsPasswordPayload>;
  resetPassword?: Maybe<UsersPermissionsLoginPayload>;
  emailConfirmation?: Maybe<UsersPermissionsLoginPayload>;
};


export type MutationCreateAttendanceArgs = {
  input?: Maybe<CreateAttendanceInput>;
};


export type MutationUpdateAttendanceArgs = {
  input?: Maybe<UpdateAttendanceInput>;
};


export type MutationDeleteAttendanceArgs = {
  input?: Maybe<DeleteAttendanceInput>;
};


export type MutationCreateGroupArgs = {
  input?: Maybe<CreateGroupInput>;
};


export type MutationUpdateGroupArgs = {
  input?: Maybe<UpdateGroupInput>;
};


export type MutationDeleteGroupArgs = {
  input?: Maybe<DeleteGroupInput>;
};


export type MutationCreateStudentArgs = {
  input?: Maybe<CreateStudentInput>;
};


export type MutationUpdateStudentArgs = {
  input?: Maybe<UpdateStudentInput>;
};


export type MutationDeleteStudentArgs = {
  input?: Maybe<DeleteStudentInput>;
};


export type MutationCreateTeacherArgs = {
  input?: Maybe<CreateTeacherInput>;
};


export type MutationUpdateTeacherArgs = {
  input?: Maybe<UpdateTeacherInput>;
};


export type MutationDeleteTeacherArgs = {
  input?: Maybe<DeleteTeacherInput>;
};


export type MutationDeleteFileArgs = {
  input?: Maybe<DeleteFileInput>;
};


export type MutationCreateRoleArgs = {
  input?: Maybe<CreateRoleInput>;
};


export type MutationUpdateRoleArgs = {
  input?: Maybe<UpdateRoleInput>;
};


export type MutationDeleteRoleArgs = {
  input?: Maybe<DeleteRoleInput>;
};


export type MutationCreateUserArgs = {
  input?: Maybe<CreateUserInput>;
};


export type MutationUpdateUserArgs = {
  input?: Maybe<UpdateUserInput>;
};


export type MutationDeleteUserArgs = {
  input?: Maybe<DeleteUserInput>;
};


export type MutationUploadArgs = {
  refId?: Maybe<Scalars['ID']>;
  ref?: Maybe<Scalars['String']>;
  field?: Maybe<Scalars['String']>;
  source?: Maybe<Scalars['String']>;
  file: Scalars['Upload'];
};


export type MutationMultipleUploadArgs = {
  refId?: Maybe<Scalars['ID']>;
  ref?: Maybe<Scalars['String']>;
  field?: Maybe<Scalars['String']>;
  source?: Maybe<Scalars['String']>;
  files: Array<Maybe<Scalars['Upload']>>;
};


export type MutationUpdateFileInfoArgs = {
  id: Scalars['ID'];
  info: FileInfoInput;
};


export type MutationLoginArgs = {
  input: UsersPermissionsLoginInput;
};


export type MutationRegisterArgs = {
  input: UsersPermissionsRegisterInput;
};


export type MutationForgotPasswordArgs = {
  email: Scalars['String'];
};


export type MutationResetPasswordArgs = {
  password: Scalars['String'];
  passwordConfirmation: Scalars['String'];
  code: Scalars['String'];
};


export type MutationEmailConfirmationArgs = {
  confirmation: Scalars['String'];
};







export enum CacheControlScope {
  Public = 'PUBLIC',
  Private = 'PRIVATE'
}

export type AttendancesQueryVariables = Exact<{
  where?: Maybe<Scalars['JSON']>;
}>;


export type AttendancesQuery = { __typename?: 'Query', attendances?: Maybe<Array<Maybe<{ __typename?: 'Attendance', id: string, date: any, group?: Maybe<{ __typename?: 'Group', id: string, name: string }>, student?: Maybe<{ __typename?: 'Student', id: string, name: string }> }>>> };

export type LoginMutationVariables = Exact<{
  input: UsersPermissionsLoginInput;
}>;


export type LoginMutation = { __typename?: 'Mutation', login: { __typename?: 'UsersPermissionsLoginPayload', jwt?: Maybe<string>, user: { __typename?: 'UsersPermissionsMe', id: string, email: string, username: string, role?: Maybe<{ __typename?: 'UsersPermissionsMeRole', id: string, name: string }> } } };

export type GroupsQueryVariables = Exact<{ [key: string]: never; }>;


export type GroupsQuery = { __typename?: 'Query', groups?: Maybe<Array<Maybe<{ __typename?: 'Group', id: string, name: string, teacher?: Maybe<{ __typename?: 'Teacher', id: string, name: string }>, students?: Maybe<Array<Maybe<{ __typename?: 'Student', id: string, name: string }>>> }>>> };

export type StudentsQueryVariables = Exact<{ [key: string]: never; }>;


export type StudentsQuery = { __typename?: 'Query', students?: Maybe<Array<Maybe<{ __typename?: 'Student', id: string }>>> };

export type TeachersQueryVariables = Exact<{ [key: string]: never; }>;


export type TeachersQuery = { __typename?: 'Query', teachers?: Maybe<Array<Maybe<{ __typename?: 'Teacher', id: string }>>> };

export type CreateTeacherMutationVariables = Exact<{
  input?: Maybe<CreateTeacherInput>;
}>;


export type CreateTeacherMutation = { __typename?: 'Mutation', createTeacher?: Maybe<{ __typename?: 'createTeacherPayload', teacher?: Maybe<{ __typename?: 'Teacher', id: string, name: string, description?: Maybe<string> }> }> };


export const AttendancesDocument = gql`
    query Attendances($where: JSON) {
  attendances(where: $where) {
    id
    group {
      id
      name
    }
    date
    student {
      id
      name
    }
  }
}
    `;

/**
 * __useAttendancesQuery__
 *
 * To run a query within a React component, call `useAttendancesQuery` and pass it any options that fit your needs.
 * When your component renders, `useAttendancesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useAttendancesQuery({
 *   variables: {
 *      where: // value for 'where'
 *   },
 * });
 */
export function useAttendancesQuery(baseOptions?: Apollo.QueryHookOptions<AttendancesQuery, AttendancesQueryVariables>) {
        return Apollo.useQuery<AttendancesQuery, AttendancesQueryVariables>(AttendancesDocument, baseOptions);
      }
export function useAttendancesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<AttendancesQuery, AttendancesQueryVariables>) {
          return Apollo.useLazyQuery<AttendancesQuery, AttendancesQueryVariables>(AttendancesDocument, baseOptions);
        }
export type AttendancesQueryHookResult = ReturnType<typeof useAttendancesQuery>;
export type AttendancesLazyQueryHookResult = ReturnType<typeof useAttendancesLazyQuery>;
export type AttendancesQueryResult = Apollo.QueryResult<AttendancesQuery, AttendancesQueryVariables>;
export const LoginDocument = gql`
    mutation Login($input: UsersPermissionsLoginInput!) {
  login(input: $input) {
    jwt
    user {
      id
      email
      role {
        id
        name
      }
      username
    }
  }
}
    `;
export type LoginMutationFn = Apollo.MutationFunction<LoginMutation, LoginMutationVariables>;

/**
 * __useLoginMutation__
 *
 * To run a mutation, you first call `useLoginMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLoginMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [loginMutation, { data, loading, error }] = useLoginMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useLoginMutation(baseOptions?: Apollo.MutationHookOptions<LoginMutation, LoginMutationVariables>) {
        return Apollo.useMutation<LoginMutation, LoginMutationVariables>(LoginDocument, baseOptions);
      }
export type LoginMutationHookResult = ReturnType<typeof useLoginMutation>;
export type LoginMutationResult = Apollo.MutationResult<LoginMutation>;
export type LoginMutationOptions = Apollo.BaseMutationOptions<LoginMutation, LoginMutationVariables>;
export const GroupsDocument = gql`
    query Groups {
  groups {
    id
    name
    teacher {
      id
      name
    }
    students {
      id
      name
    }
  }
}
    `;

/**
 * __useGroupsQuery__
 *
 * To run a query within a React component, call `useGroupsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGroupsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGroupsQuery({
 *   variables: {
 *   },
 * });
 */
export function useGroupsQuery(baseOptions?: Apollo.QueryHookOptions<GroupsQuery, GroupsQueryVariables>) {
        return Apollo.useQuery<GroupsQuery, GroupsQueryVariables>(GroupsDocument, baseOptions);
      }
export function useGroupsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GroupsQuery, GroupsQueryVariables>) {
          return Apollo.useLazyQuery<GroupsQuery, GroupsQueryVariables>(GroupsDocument, baseOptions);
        }
export type GroupsQueryHookResult = ReturnType<typeof useGroupsQuery>;
export type GroupsLazyQueryHookResult = ReturnType<typeof useGroupsLazyQuery>;
export type GroupsQueryResult = Apollo.QueryResult<GroupsQuery, GroupsQueryVariables>;
export const StudentsDocument = gql`
    query Students {
  students {
    id
  }
}
    `;

/**
 * __useStudentsQuery__
 *
 * To run a query within a React component, call `useStudentsQuery` and pass it any options that fit your needs.
 * When your component renders, `useStudentsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useStudentsQuery({
 *   variables: {
 *   },
 * });
 */
export function useStudentsQuery(baseOptions?: Apollo.QueryHookOptions<StudentsQuery, StudentsQueryVariables>) {
        return Apollo.useQuery<StudentsQuery, StudentsQueryVariables>(StudentsDocument, baseOptions);
      }
export function useStudentsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<StudentsQuery, StudentsQueryVariables>) {
          return Apollo.useLazyQuery<StudentsQuery, StudentsQueryVariables>(StudentsDocument, baseOptions);
        }
export type StudentsQueryHookResult = ReturnType<typeof useStudentsQuery>;
export type StudentsLazyQueryHookResult = ReturnType<typeof useStudentsLazyQuery>;
export type StudentsQueryResult = Apollo.QueryResult<StudentsQuery, StudentsQueryVariables>;
export const TeachersDocument = gql`
    query Teachers {
  teachers {
    id
  }
}
    `;

/**
 * __useTeachersQuery__
 *
 * To run a query within a React component, call `useTeachersQuery` and pass it any options that fit your needs.
 * When your component renders, `useTeachersQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useTeachersQuery({
 *   variables: {
 *   },
 * });
 */
export function useTeachersQuery(baseOptions?: Apollo.QueryHookOptions<TeachersQuery, TeachersQueryVariables>) {
        return Apollo.useQuery<TeachersQuery, TeachersQueryVariables>(TeachersDocument, baseOptions);
      }
export function useTeachersLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<TeachersQuery, TeachersQueryVariables>) {
          return Apollo.useLazyQuery<TeachersQuery, TeachersQueryVariables>(TeachersDocument, baseOptions);
        }
export type TeachersQueryHookResult = ReturnType<typeof useTeachersQuery>;
export type TeachersLazyQueryHookResult = ReturnType<typeof useTeachersLazyQuery>;
export type TeachersQueryResult = Apollo.QueryResult<TeachersQuery, TeachersQueryVariables>;
export const CreateTeacherDocument = gql`
    mutation CreateTeacher($input: createTeacherInput) {
  createTeacher(input: $input) {
    teacher {
      id
      name
      description
    }
  }
}
    `;
export type CreateTeacherMutationFn = Apollo.MutationFunction<CreateTeacherMutation, CreateTeacherMutationVariables>;

/**
 * __useCreateTeacherMutation__
 *
 * To run a mutation, you first call `useCreateTeacherMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateTeacherMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createTeacherMutation, { data, loading, error }] = useCreateTeacherMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateTeacherMutation(baseOptions?: Apollo.MutationHookOptions<CreateTeacherMutation, CreateTeacherMutationVariables>) {
        return Apollo.useMutation<CreateTeacherMutation, CreateTeacherMutationVariables>(CreateTeacherDocument, baseOptions);
      }
export type CreateTeacherMutationHookResult = ReturnType<typeof useCreateTeacherMutation>;
export type CreateTeacherMutationResult = Apollo.MutationResult<CreateTeacherMutation>;
export type CreateTeacherMutationOptions = Apollo.BaseMutationOptions<CreateTeacherMutation, CreateTeacherMutationVariables>;

      export interface PossibleTypesResultData {
        possibleTypes: {
          [key: string]: string[]
        }
      }
      const result: PossibleTypesResultData = {
  "possibleTypes": {
    "Morph": [
      "UsersPermissionsMe",
      "UsersPermissionsMeRole",
      "UsersPermissionsLoginPayload",
      "UserPermissionsPasswordPayload",
      "Attendance",
      "AttendanceConnection",
      "AttendanceAggregator",
      "AttendanceGroupBy",
      "AttendanceConnectionId",
      "AttendanceConnectionCreated_at",
      "AttendanceConnectionUpdated_at",
      "AttendanceConnectionStudent",
      "AttendanceConnectionGroup",
      "AttendanceConnectionDate",
      "AttendanceConnectionPublished_at",
      "createAttendancePayload",
      "updateAttendancePayload",
      "deleteAttendancePayload",
      "Group",
      "GroupConnection",
      "GroupAggregator",
      "GroupGroupBy",
      "GroupConnectionId",
      "GroupConnectionCreated_at",
      "GroupConnectionUpdated_at",
      "GroupConnectionName",
      "GroupConnectionDescription",
      "GroupConnectionTeacher",
      "GroupConnectionPublished_at",
      "createGroupPayload",
      "updateGroupPayload",
      "deleteGroupPayload",
      "Student",
      "StudentConnection",
      "StudentAggregator",
      "StudentGroupBy",
      "StudentConnectionId",
      "StudentConnectionCreated_at",
      "StudentConnectionUpdated_at",
      "StudentConnectionName",
      "StudentConnectionDescription",
      "StudentConnectionPublished_at",
      "createStudentPayload",
      "updateStudentPayload",
      "deleteStudentPayload",
      "Teacher",
      "TeacherConnection",
      "TeacherAggregator",
      "TeacherGroupBy",
      "TeacherConnectionId",
      "TeacherConnectionCreated_at",
      "TeacherConnectionUpdated_at",
      "TeacherConnectionName",
      "TeacherConnectionAvatar",
      "TeacherConnectionDescription",
      "TeacherConnectionPublished_at",
      "createTeacherPayload",
      "updateTeacherPayload",
      "deleteTeacherPayload",
      "UploadFile",
      "UploadFileConnection",
      "UploadFileAggregator",
      "UploadFileAggregatorSum",
      "UploadFileAggregatorAvg",
      "UploadFileAggregatorMin",
      "UploadFileAggregatorMax",
      "UploadFileGroupBy",
      "UploadFileConnectionId",
      "UploadFileConnectionCreated_at",
      "UploadFileConnectionUpdated_at",
      "UploadFileConnectionName",
      "UploadFileConnectionAlternativeText",
      "UploadFileConnectionCaption",
      "UploadFileConnectionWidth",
      "UploadFileConnectionHeight",
      "UploadFileConnectionFormats",
      "UploadFileConnectionHash",
      "UploadFileConnectionExt",
      "UploadFileConnectionMime",
      "UploadFileConnectionSize",
      "UploadFileConnectionUrl",
      "UploadFileConnectionPreviewUrl",
      "UploadFileConnectionProvider",
      "UploadFileConnectionProvider_metadata",
      "deleteFilePayload",
      "UsersPermissionsPermission",
      "UsersPermissionsRole",
      "UsersPermissionsRoleConnection",
      "UsersPermissionsRoleAggregator",
      "UsersPermissionsRoleGroupBy",
      "UsersPermissionsRoleConnectionId",
      "UsersPermissionsRoleConnectionName",
      "UsersPermissionsRoleConnectionDescription",
      "UsersPermissionsRoleConnectionType",
      "createRolePayload",
      "updateRolePayload",
      "deleteRolePayload",
      "UsersPermissionsUser",
      "UsersPermissionsUserConnection",
      "UsersPermissionsUserAggregator",
      "UsersPermissionsUserGroupBy",
      "UsersPermissionsUserConnectionId",
      "UsersPermissionsUserConnectionCreated_at",
      "UsersPermissionsUserConnectionUpdated_at",
      "UsersPermissionsUserConnectionUsername",
      "UsersPermissionsUserConnectionEmail",
      "UsersPermissionsUserConnectionProvider",
      "UsersPermissionsUserConnectionConfirmed",
      "UsersPermissionsUserConnectionBlocked",
      "UsersPermissionsUserConnectionRole",
      "createUserPayload",
      "updateUserPayload",
      "deleteUserPayload"
    ]
  }
};
      export default result;
    