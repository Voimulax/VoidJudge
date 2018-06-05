import { UserType } from '../../core/auth/user.model';

export interface TeacherInfo {
  id?: number;
  userName: string;
  name: string;
  userType: UserType;
  password?: string;
}

export interface TeacherInfoWithSymbol {
  userName: string;
  name: string;
  userType: UserType;
  password?: string;
  sid: symbol;
}

export interface TeacherListDialogData {
  repeatList: Array<TeacherInfoWithSymbol>;
}
