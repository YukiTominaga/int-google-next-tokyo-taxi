import { TestBed, inject } from '@angular/core/testing';

import { FirestoreTaxiService } from './firestore-taxi.service';

describe('FirestoreTaxiService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FirestoreTaxiService]
    });
  });

  it('should be created', inject([FirestoreTaxiService], (service: FirestoreTaxiService) => {
    expect(service).toBeTruthy();
  }));
});
