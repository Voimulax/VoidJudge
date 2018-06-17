export enum ProblemType {
  TestPaper,
  Judge
}

export interface ContestProblemInfo {
  id: number;
  name: string;
  type: ProblemType;
  content: string;
  isSubmitted: boolean;
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
