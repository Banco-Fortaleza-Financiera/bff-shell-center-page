import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { Router, provideRouter } from '@angular/router';
import { App } from './app';

describe('App', () => {
  const authKey = 'bff_shell_auth_session';

  beforeEach(async () => {
    sessionStorage.clear();

    await TestBed.configureTestingModule({
      imports: [App],
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should render title', async () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    await fixture.whenStable();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.shell__brand-text')?.textContent).toContain(
      'BFF - Center Page'
    );
  });

  it('should logout and navigate to login when clicking logout button', async () => {
    sessionStorage.setItem(
      authKey,
      JSON.stringify({
        authenticated: true,
        idUser: 10000,
        accessToken: 'token',
        tokenType: 'Bearer',
        expiresIn: 3600,
        expiresAt: new Date(Date.now() + 3600 * 1000).toISOString(),
        sessionId: 'session-id',
        deviceIp: '127.0.0.1',
        createdAt: new Date().toISOString(),
      })
    );

    const router = TestBed.inject(Router);
    const navigateSpy = jest.spyOn(router, 'navigateByUrl').mockResolvedValue(true);
    const fixture = TestBed.createComponent(App);

    fixture.detectChanges();
    await fixture.whenStable();

    const button = fixture.nativeElement.querySelector('.shell__logout') as HTMLButtonElement;
    button.click();

    expect(sessionStorage.getItem(authKey)).toBeNull();
    expect(navigateSpy).toHaveBeenCalledWith('/login');
  });
});
