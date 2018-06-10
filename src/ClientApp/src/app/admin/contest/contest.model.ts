export interface ContestInfo {
  id: number;
  name: string;
  authorName: string;
  startTime: number;
  endTime: number;
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
