import { UserType } from '../../core/auth/user.model';

export interface StudentInfo {
  id?: number;
  loginName: string;
  userName: string;
  group: string;
  password?: string;
  userType?: UserType;
}

export interface StudentInfoWithSymbol {
  loginName: string;
  userName: string;
  group: string;
  password?: string;
  sid: symbol;
}

export interface StudentListDialogData {
  type: '创建' | '导入';
  repeatList: Array<StudentInfoWithSymbol>;
}

export enum PutStudentResultType {
  ok, concurrencyException, userNotFound, error
}

export interface PutStudentResult {
  type: PutStudentResultType;
  user?: StudentInfo;
}

export enum DeleteStudentResultType {
  ok, forbiddance, userNotFound, error
}

export enum StudentResultType {
  ok, wrong, repeat, error
}

export interface StudentResult {
  type: StudentResultType;
  repeat?: { loginName: string }[];
}
