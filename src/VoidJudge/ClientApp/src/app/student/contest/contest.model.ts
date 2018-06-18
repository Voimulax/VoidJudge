export enum ContestState {
  NoStarted,
  InProgress,
  Ended
}

export interface ContestInfo {
  id: number;
  name: string;
  ownerName: string;
  startTime: number;
  endTime: number;
  notice?: string;
  state?: ContestState;
}

export enum GetContestResultType {
  ok,
  contestNotFound,
  invaildToken,
  error
}

export interface GetContestsResult {
  type: GetContestResultType;
  data: ContestInfo[];
}

export enum SubmissionType {
  binary,
  text
}

export interface SubmissionInfo {
  id?: number;
  contestId: number;
  problemId: number;
  studentId: string;
  type: SubmissionType;
  content?: string;
}

export enum AddSubmissionResultType {
  ok,
  unauthorized,
  contestNotFound,
  problemNotFound,
  forbiddance,
  fileTooBig,
  wrong,
  error
}
