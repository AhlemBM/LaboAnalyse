import { TestBed } from '@angular/core/testing';

import { KitsService } from './kits.service';

describe('KitsService', () => {
  let service: KitsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(KitsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
