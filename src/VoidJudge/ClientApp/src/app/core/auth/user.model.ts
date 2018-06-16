export enum RoleType {
  admin,
  teacher,
  student
}

export interface User {
  id: number;
  loginName: string;
  userName: string;
  roleType: RoleType;
}

export interface StudentUser extends User {
  group: string;
}

export interface LoginUser {
  loginName: string;
  password: string;
}

export interface ResetUser {
  password: string;
  newPassword: string;
}

export enum PutUserResultType {
  ok,
  forbiddance,
  concurrencyException,
  userNotFound,
  repeat,
  wrong,
  error
}

export interface PutResult<T extends UserInfo> {
  type: PutUserResultType;
  user?: T;
}

export enum DeleteUserResultType {
  ok,
  forbiddance,
  userNotFound,
  error
}

export enum AddUserResultType {
  ok,
  wrong,
  repeat,
  error
}

export interface AddUserResult {
  type: AddUserResultType;
  repeat?: { loginName: string }[];
}

export interface UserInfo {
  id?: number;
  loginName: string;
  userName: string;
  password?: string;
  roleType?: RoleType;
}

export interface StudentInfo extends UserInfo {
  group: string;
}

export interface UserInfoWithSymbol {
  loginName: string;
  userName: string;
  password?: string;
  roleType?: RoleType;
  sid: symbol;
}

export interface StudentInfoWithSymbol extends UserInfoWithSymbol {
  group: string;
}

export interface UserListDialogData<T extends UserInfoWithSymbol> {
  type: '创建' | '导入';
  repeatList: Array<T>;
}

export function getRoleType(str: string) {
  if (str === '0') {
    return RoleType.admin;
  } else if (str === '1') {
    return RoleType.teacher;
  } else {
    return RoleType.student;
  }
}

export function getRoleTypeName(ut: RoleType | string) {
  switch (ut) {
    case RoleType.admin:
      return '管理员';
    case RoleType.teacher:
      return '教师';
    case RoleType.student:
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
