import { TestBed, inject } from '@angular/core/testing';

import { RestJiraService } from './rest-jira.service';

describe('RestJiraService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RestJiraService]
    });
  });

  it('should be created', inject([RestJiraService], (service: RestJiraService) => {
    expect(service).toBeTruthy();
  }));
});
