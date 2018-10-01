import { TestBed, inject } from '@angular/core/testing';

import { RestTrelloService } from './rest-trello.service';

describe('RestTrelloService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RestTrelloService]
    });
  });

  it('should be created', inject([RestTrelloService], (service: RestTrelloService) => {
    expect(service).toBeTruthy();
  }));
});
