import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { map } from 'rxjs';

import { environment } from '../../environments/environment';
import { PublicIpResponse } from '../interfaces/public-response.interface';


@Injectable({
  providedIn: 'root',
})
export class DeviceInfoService {
  private readonly http = inject(HttpClient);

  getPublicIp() {
    return this.http
      .get<PublicIpResponse>(environment.deviceIpProviderUrl)
      .pipe(map((response) => response.ip));
  }
}
