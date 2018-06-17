import { ContestStudentModule } from './contest-student.module';

describe('ContestStudentModule', () => {
  let contestStudentModule: ContestStudentModule;

  beforeEach(() => {
    contestStudentModule = new ContestStudentModule();
  });

  it('should create an instance', () => {
    expect(contestStudentModule).toBeTruthy();
  });
});
