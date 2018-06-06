import { UserType } from '../../core/auth/user.model';

export interface TeacherInfo {
  id?: number;
  loginName: string;
  userName: string;
  userType: UserType;
  password?: string;
}

export interface TeacherInfoWithSymbol {
  loginName: string;
  userName: string;
  userType: UserType;
  password?: string;
  sid: symbol;
}

export interface TeacherListDialogData {
  repeatList: Array<TeacherInfoWithSymbol>;
}
