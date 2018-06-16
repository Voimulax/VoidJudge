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
  Ok,
  NotFound,
  Error
}

export interface GetContestsResult {
  type: GetContestResultType;
  data: ContestInfo[];
}
