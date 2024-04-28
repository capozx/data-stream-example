import { TestBed } from '@angular/core/testing';

import { DataStreamGeneratorService } from './data-stream-generator.service';

describe('DataStreamGeneratorService', () => {
  let service: DataStreamGeneratorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DataStreamGeneratorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
