export enum LoginType {
  Logged,
  NoLogged
}

export enum SubmitType {
  Submitted,
  NoSubmitted
}

export interface ContestStudentInfo {
  sid?: symbol;
  studentId: number;
  userName: string;
  group: string;
  isLogged?: LoginType;
  isSubmitted?: SubmitType;
}

export interface ContestStudentListDialogData {
  repeatList?: ContestStudentInfo[];
  notFoundList?: ContestStudentInfo[];
}

export enum AddContestStudentResultType {
  ok,
  unauthorized,
  forbiddance,
  contestNotFound,
  studentsNotFound,
  wrong,
  error
}

export interface AddContestStudentsResult {
  type: AddContestStudentResultType;
  notFoundList: { studentId: number }[];
}

export enum GetContestStudentResultType {
  ok,
  unauthorized,
  contestNotFound,
  error
}

export interface GetContestStudentsResult {
  type: GetContestStudentResultType;
  notFoundList: ContestStudentInfo[];
}
