export enum UserType {
  admin,
  teacher,
  student
}

export interface User {
  id: number;
  loginName: string;
  userName: string;
  userType: UserType;
}

export interface StudentUser extends User {
  group: string;
}

export interface LoginUser {
  loginName: string;
  password: string;
}

export interface ResetUser extends LoginUser {
  newPassword: string;
}

export enum PutResultType {
  ok,
  concurrencyException,
  userNotFound,
  error
}

export interface PutResult<T extends UserInfo> {
  type: PutResultType;
  user?: T;
}

export enum DeleteResultType {
  ok,
  forbiddance,
  userNotFound,
  error
}

export enum UserResultType {
  ok,
  wrong,
  repeat,
  error
}

export interface UserResult {
  type: UserResultType;
  repeat?: { loginName: string }[];
}

export interface UserInfo {
  id?: number;
  loginName: string;
  userName: string;
  password?: string;
  userType?: UserType;
}

export interface StudentInfo extends UserInfo {
  group: string;
}

export interface UserInfoWithSymbol {
  loginName: string;
  userName: string;
  password?: string;
  userType?: UserType;
  sid: symbol;
}

export interface StudentInfoWithSymbol extends UserInfoWithSymbol {
  group: string;
}

export interface UserListDialogData<T extends UserInfoWithSymbol> {
  type: '创建' | '导入';
  repeatList: Array<T>;
}

export function getUserType(str: string) {
  if (str === '0') {
    return UserType.admin;
  } else if (str === '1') {
    return UserType.teacher;
  } else {
    return UserType.student;
  }
}

export function getUserTypeName(ut: UserType | string) {
  switch (ut) {
    case UserType.admin:
      return '管理员';
    case UserType.teacher:
      return '教师';
    case UserType.student:
      return '学生';
    case '0':
      return '管理员';
    case '1':
      return '教师';
    case '2':
      return '学生';
    default:
      return '用户';
  }
}
