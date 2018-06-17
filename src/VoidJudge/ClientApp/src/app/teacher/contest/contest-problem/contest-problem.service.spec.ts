import { TestBed, inject } from '@angular/core/testing';

import { ContestProblemService } from './contest-problem.service';

describe('ContestProblemService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ContestProblemService]
    });
  });

  it('should be created', inject([ContestProblemService], (service: ContestProblemService) => {
    expect(service).toBeTruthy();
  }));
});
