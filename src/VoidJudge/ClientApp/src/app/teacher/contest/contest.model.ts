import { ContestStudentInfo } from './contest-student/contest-student.model';
import { ContestProblemInfo } from './contest-problem/contest-problem.model';

export enum ContestState {
  noPublished,
  noStarted,
  inProgress,
  ended
}

export interface ContestInfo {
  id?: number;
  name: string;
  startTime?: number;
  endTime?: number;
  notice?: string;
  students?: ContestStudentInfo[];
  state?: ContestState;
  submissionsFileName?: string;
}

export enum GetContestResultType {
  ok,
  contestNotFound,
  error
}

export interface GetContestsResult {
  type: GetContestResultType;
  data?: ContestInfo[];
}

export enum AddContestResultType {
  ok,
  wrong,
  error
}

export enum PutContestResultType {
  ok,
  unauthorized,
  concurrencyException,
  contestNotFound,
  wrong,
  error
}

export enum DeleteContestResultType {
  ok,
  unauthorized,
  forbiddance,
  contestNotFound,
  error
}

export enum GetContestSubmissionsResultType {
  ok,
  unauthorized,
  contestNotFound,
  forbiddance,
  error
}
