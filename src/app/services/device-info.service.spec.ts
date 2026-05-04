import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { environment } from '../../environments/environment';
import { DeviceInfoService } from './device-info.service';

describe('DeviceInfoService', () => {
  let service: DeviceInfoService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });

    service = TestBed.inject(DeviceInfoService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should return only the public IP from the provider response', () => {
    let publicIp = '';

    service.getPublicIp().subscribe((ip) => {
      publicIp = ip;
    });

    const request = httpMock.expectOne(environment.deviceIpProviderUrl);
    expect(request.request.method).toBe('GET');

    request.flush({ ip: '172.16.0.1' });

    expect(publicIp).toBe('172.16.0.1');
  });
});
