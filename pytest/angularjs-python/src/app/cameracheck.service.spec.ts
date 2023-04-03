import { TestBed } from '@angular/core/testing';

import { CameracheckService } from './cameracheck.service';

describe('CameracheckService', () => {
  let service: CameracheckService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CameracheckService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
