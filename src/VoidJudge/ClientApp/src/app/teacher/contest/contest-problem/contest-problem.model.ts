export enum ProblemType {
  testPaper,
  judge
}

export interface ContestProblemInfo {
  id?: number;
  contestId: number;
  name: string;
  type: ProblemType;
  content?: string;
}

export enum AddContestProblemResultType {
  ok,
  unauthorized,
  contestNotFound,
  forbiddance,
  fileTooBig,
  wrong,
  error
}

export enum GetContestProblemResultType {
  ok,
  unauthorized,
  contestNotFound,
  error
}

export interface GetContestProblemResult {
  type: GetContestProblemResultType;
  data?: ContestProblemInfo[];
}

export enum DeleteContestProblemResultType {
  ok,
  unauthorized,
  contestNotFound,
  problemNotFound,
  forbiddance,
  error
}
