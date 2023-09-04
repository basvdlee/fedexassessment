import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import {
  SpectatorService,
  SpyObject,
  createServiceFactory,
} from '@ngneat/spectator';
import { SignUpService } from './sign-up.service';

describe('SignUpService', () => {
  let spectator: SpectatorService<SignUpService>;
  let service: SignUpService;
  let httpController: SpyObject<HttpTestingController>;
  const createService = createServiceFactory({
    service: SignUpService,
    imports: [HttpClientTestingModule],
  });

  beforeEach(() => {
    spectator = createService();
    service = spectator.service;
    httpController = spectator.inject(HttpTestingController);
  });

  it('should update the status correctly during the http call', (done) => {
    service.register({}).subscribe(() => {
      expect(service.status()).toEqual('success');
      done();
    });

    const request = httpController.expectOne('https://demo-api.now.sh/users');
    expect(service.status()).toEqual('loading');
    expect(request.request.method).toEqual('POST');

    request.flush({});
    httpController.verify();
  });

  it('should set status to error when http call errors', () => {
    service.register({}).subscribe();
    const request = httpController.expectOne('https://demo-api.now.sh/users');
    request.error(new ProgressEvent(''));
    httpController.verify();

    expect(service.status()).toEqual('error');
  });
});
