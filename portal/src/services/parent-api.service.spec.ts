import { TestBed } from '@angular/core/testing';

import { ParentApiService } from './parent-api.service';

describe('ParentApiService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ParentApiService = TestBed.get(ParentApiService);
    expect(service).toBeTruthy();
  });
});
