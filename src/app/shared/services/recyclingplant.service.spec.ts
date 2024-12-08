import { TestBed } from '@angular/core/testing';

import { RecyclingplantService } from './recyclingplant.service';

describe('RecyclingplantService', () => {
  let service: RecyclingplantService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RecyclingplantService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
