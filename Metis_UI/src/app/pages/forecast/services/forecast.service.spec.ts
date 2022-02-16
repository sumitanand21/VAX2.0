import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ForecastService } from './forecast.service';

describe('ForecastService', () => {
  let httpMock: HttpTestingController;
  beforeEach(() => TestBed.configureTestingModule({
    imports: [HttpClientTestingModule],
    providers: [],
  }));

  beforeEach(() => {
    httpMock = TestBed.get(HttpTestingController);
  });

  it('should be created', () => {
    const service: ForecastService = TestBed.get(ForecastService);
    expect(service).toBeTruthy();
  });
});
