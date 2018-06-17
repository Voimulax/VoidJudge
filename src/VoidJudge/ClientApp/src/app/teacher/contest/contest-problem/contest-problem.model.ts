export enum ProblemType {
  TestPaper,
  Judge
}

export interface ContestProblemInfo {
  id?: number;
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
