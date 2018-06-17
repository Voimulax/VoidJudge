import { ContestProblemModule } from './contest-problem.module';

describe('ContestProblemModule', () => {
  let contestProblemModule: ContestProblemModule;

  beforeEach(() => {
    contestProblemModule = new ContestProblemModule();
  });

  it('should create an instance', () => {
    expect(contestProblemModule).toBeTruthy();
  });
});
