export enum ContestState {
  NoStarted,
  InProgress,
  Ended
}

export interface ContestInfo {
  id: number;
  name: string;
  teacherName: string;
  startTime: number;
  endTime: number;
  notice?: string;
  state?: ContestState;
}
