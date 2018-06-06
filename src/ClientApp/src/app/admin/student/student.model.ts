export interface StudentInfo {
  id?: number;
  loginName: string;
  userName: string;
  group: string;
  password?: string;
}

export interface StudentInfoWithSymbol {
  loginName: string;
  userName: string;
  group: string;
  password?: string;
  sid: symbol;
}

export interface StudentListDialogData {
  repeatList: Array<StudentInfoWithSymbol>;
}
