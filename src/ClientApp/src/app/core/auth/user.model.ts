export enum UserType {
  admin,
  teacher,
  student
}

export interface User {
  id: number;
  loginName: string;
  userName: string;
  userType: UserType;
}

export interface StudentUser extends User {
  group: string;
}

export function getUserType(str: string) {
  if (str === '0') {
    return UserType.admin;
  } else if (str === '1') {
    return UserType.teacher;
  } else {
    return UserType.student;
  }
}
