export enum UserType {
  admin,
  teacher,
  student
}

export interface User {
  id: number;
  userName: string;
  name: string;
  userType: UserType;
}

export interface StudentUser extends User {
  group: string;
}

export const Users: Array<User> = [
  { id: 1, userName: 'admin', name: 'admin', userType: UserType.admin },
  { id: 2, userName: 'teacher', name: 'teacher', userType: UserType.teacher },
  { id: 3, userName: '123', name: 'student', userType: UserType.student }
];
