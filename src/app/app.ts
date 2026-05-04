import { Component, inject, signal } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive, Router } from '@angular/router';
import { getMicroFrontends } from './config/micro-frontend-routes';
import { MicroFrontendConfig } from './interfaces/micro-frontend-config.interface';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  protected readonly title = signal('BFF - Center Page');

  protected isAuthenticated(): boolean {
    return this.authService.isAuthenticated();
  }

  protected microFrontends(): MicroFrontendConfig[] {
    return getMicroFrontends();
  }

  protected logout(): void {
    this.authService.logout();
    void this.router.navigateByUrl('/login');
  }
}
