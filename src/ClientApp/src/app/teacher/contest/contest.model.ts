import { ContestStudentInfo } from './contest-student/contest-student.model';

export enum ContestState {
  NoPublished,
  NoStarted,
  InProgress,
  Ended
}

export interface ContestInfo {
  id?: number;
  name: string;
  startTime?: number;
  endTime?: number;
  notice?: string;
  students?: ContestStudentInfo[];
  state?: ContestState;
}

export enum GetContestResultType {
  Ok,
  NotFound,
  Error
}

export interface GetContestsResult {
  type: GetContestResultType;
  data: ContestInfo[];
}
