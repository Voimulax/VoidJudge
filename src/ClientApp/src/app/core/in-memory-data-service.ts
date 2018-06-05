import { InMemoryDbService } from 'angular-in-memory-web-api';
import { ContestInfo } from '../student/contest/contest.model';
import { StudentInfo } from '../admin/student/student.model';
import { SubmissionFile } from '../student/contest/contest-detail/contest-submission/submission.model';
import { TeacherInfo } from '../admin/teacher/teacher.model';
import { UserType } from './auth/user.model';

export class InMemoryDataService extends InMemoryDbService {
  createDb() {
    const n = new Date();
    const ny = new Date(new Date(n).setDate(n.getDate() - 1));
    const nt = new Date(new Date(n).setDate(n.getDate() + 1));
    function format(num: number) {
      if (num < 10) {
        return `0${num}`;
      } else {
        return `${num}`;
      }
    }
    const contests: ContestInfo[] = [
      {
        id: 1,
        name: 'contest1',
        teacherName: 'Mr.V',
        startTime: new Date(
          `${nt.getFullYear()}-${format(nt.getMonth() + 1)}-${format(nt.getDate())}T09:00:00.000+08:00`
        ).getTime(),
        endTime: new Date(
          `${nt.getFullYear()}-${format(nt.getMonth() + 1)}-${format(nt.getDate())}T14:00:00.000+08:00`
        ).getTime(),
        notice: 'contest1公告'
      },
      {
        id: 2,
        name: 'contest2',
        teacherName: 'Mr.O',
        startTime: new Date(
          `${ny.getFullYear()}-${format(ny.getMonth() + 1)}-${format(ny.getDate())}T00:00:00.000+08:00`
        ).getTime(),
        endTime: new Date(
          `${nt.getFullYear()}-${format(nt.getMonth() + 1)}-${format(nt.getDate())}T00:00:00.000+08:00`
        ).getTime(),
        notice: 'contest2公告'
      },
      {
        id: 3,
        name: 'contest3',
        teacherName: 'Mr.I',
        startTime: new Date(
          `${ny.getFullYear()}-${format(ny.getMonth() + 1)}-${format(ny.getDate())}T09:00:00.000+08:00`
        ).getTime(),
        endTime: new Date(
          `${ny.getFullYear()}-${format(ny.getMonth() + 1)}-${format(ny.getDate())}T14:00:00.000+08:00`
        ).getTime(),
        notice: 'contest3公告'
      }
    ];
    const students: StudentInfo[] = [
      { id: 3, userName: 's@w.a', name: 'student', group: '15-1' }
    ];
    const teachers: TeacherInfo[] = [
      { id: 1, userName: 'a@w.a', name: 'admin', userType: UserType.admin },
      { id: 2, userName: 't@w.a', name: 'teacher', userType: UserType.teacher }
    ];
    const submissionFiles: SubmissionFile[] = [
      { id: 1, name: 'file1' }
    ];
    return { contest: contests, students, teachers, submissionfile: submissionFiles };
  }
}
