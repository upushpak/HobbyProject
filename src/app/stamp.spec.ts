import { TestBed } from '@angular/core/testing';

import { Stamp } from './stamp';

describe('Stamp', () => {
  let service: Stamp;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Stamp);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
