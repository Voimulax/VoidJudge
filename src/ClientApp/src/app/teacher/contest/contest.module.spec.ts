import { ContestModule } from './contest.module';

describe('ContestModule', () => {
  let contestModule: ContestModule;

  beforeEach(() => {
    contestModule = new ContestModule();
  });

  it('should create an instance', () => {
    expect(contestModule).toBeTruthy();
  });
});
