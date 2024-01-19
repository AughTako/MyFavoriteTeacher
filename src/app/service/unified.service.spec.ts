import { TestBed } from '@angular/core/testing';

import { UnifiedService } from './unified.service';

describe('UnifiedService', () => {
  let service: UnifiedService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UnifiedService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
