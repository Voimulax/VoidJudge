export enum LoginType {
  Logged,
  NoLogged
}

export enum SubmitType {
  Submitted,
  NoSubmitted
}

export interface ContestStudentInfo {
  id?: number;
  loginName: string;
  userName: string;
  group: string;
  isLogged?: LoginType;
  isSubmitted?: SubmitType;
}

export interface ContestStudentListDialogData {
  repeatList?: ContestStudentInfo[];
  errorList?: ContestStudentInfo[];
}
