import { errorInterceptor } from './error-interceptor';
import { HttpRequest } from '@angular/common/http';
import { of, throwError, lastValueFrom } from 'rxjs';

describe('errorInterceptor', () => {
  it('should pass through success', async () => {
    const req = new HttpRequest('GET', '/test');
    const next = (r: any) => of({ body: {} } as any);
    const res = await lastValueFrom(errorInterceptor(req, next as any));
    expect(res).toBeTruthy();
  });

  it('should throw on error', async () => {
    const req = new HttpRequest('GET', '/test');
    const next = (r: any) => throwError(() => new Error('fail'));
    await expectAsync(lastValueFrom(errorInterceptor(req, next as any))).toBeRejected();
  });
});
