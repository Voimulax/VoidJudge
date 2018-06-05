import { MaterialViewModule } from './material-view.module';

describe('MaterialViewModule', () => {
  let materialViewModule: MaterialViewModule;

  beforeEach(() => {
    materialViewModule = new MaterialViewModule();
  });

  it('should create an instance', () => {
    expect(materialViewModule).toBeTruthy();
  });
});
