export interface StudentInfo {
  id?: number;
  userName: string;
  name: string;
  group: string;
  password?: string;
}

export interface StudentInfoWithSymbol {
  userName: string;
  name: string;
  group: string;
  password?: string;
  sid: symbol;
}

export interface StudentListDialogData {
  repeatList: Array<StudentInfoWithSymbol>;
}
