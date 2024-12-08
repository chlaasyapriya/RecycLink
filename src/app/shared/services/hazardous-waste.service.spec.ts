import { TestBed } from '@angular/core/testing';

import { HazardousWasteService } from './hazardous-waste.service';

describe('HazardousWasteService', () => {
  let service: HazardousWasteService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HazardousWasteService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
