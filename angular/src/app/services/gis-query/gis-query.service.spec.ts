import { TestBed, inject } from '@angular/core/testing';

import { GisQueryService } from './gis-query.service';

describe('GisQueryService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GisQueryService]
    });
  });

  it('should be created', inject([GisQueryService], (service: GisQueryService) => {
    expect(service).toBeTruthy();
  }));
});
