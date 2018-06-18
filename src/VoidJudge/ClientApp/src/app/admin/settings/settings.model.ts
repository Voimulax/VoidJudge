export enum SettingsType {
  uploadLimit
}
export interface SettingsInfo {
  type: SettingsType;
  value: string;
}

export enum GetSettingsResultType {
  ok,
  error
}

export interface GetSettingsResult {
  type: GetSettingsResultType;
  data?: SettingsInfo[];
}

export enum PutSettingsResultType {
  ok,
  wrong,
  error
}
