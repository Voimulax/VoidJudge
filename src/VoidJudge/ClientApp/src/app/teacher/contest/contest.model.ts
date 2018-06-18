import { ContestStudentInfo } from './contest-student/contest-student.model';

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
  submissionInfos?: SubmissionInfo[];
  state?: ContestState;
  submissionsFileName?: string;
}

export interface SubmissionState {
  problemName: string;
  isSubmitted: boolean;
}

export interface SubmissionInfo {
  id: number;
  studentId: number;
  userName: string;
  group: string;
  isLogged: boolean;
  submissionStates?: SubmissionState[];
  isSubmitted?: boolean;
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

export enum GetContestSubmissionResultType {
  ok,
  unauthorized,
  contestNotFound,
  forbiddance,
  error
}

export interface GetContestSubmissionInfosResult {
  type: GetContestSubmissionResultType;
  data?: SubmissionInfo[];
}
