import { TestBed, inject } from '@angular/core/testing';

import { RestZenService } from './rest-zen.service';

describe('RestZenService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RestZenService]
    });
  });

  it('should be created', inject([RestZenService], (service: RestZenService) => {
    expect(service).toBeTruthy();
  }));
});
