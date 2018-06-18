export interface ContestStudentInfo {
  sid?: symbol;
  studentId: number;
  userName: string;
  group: string;
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
