import { Component, OnInit, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize } from 'rxjs';

import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  protected readonly isSubmitting = signal(false);
  protected readonly errorMessage = signal('');

  protected readonly loginForm = new FormGroup({
    idUser: new FormControl<number | null>(null, {
      validators: [Validators.required, Validators.min(10000)],
    }),
    password: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(8)],
    }),
  });

  ngOnInit(): void {
    if (this.authService.isAuthenticated()) {
      void this.router.navigateByUrl(this.getReturnUrl());
    }
  }

  protected submit(): void {
    this.errorMessage.set('');
    this.loginForm.markAllAsTouched();

    if (this.loginForm.invalid) {
      return;
    }

    const idUser = this.loginForm.controls.idUser.value;

    if (idUser === null) {
      return;
    }

    this.isSubmitting.set(true);

    this.authService
      .login({
        idUser,
        password: this.loginForm.controls.password.value,
      })
      .pipe(finalize(() => this.isSubmitting.set(false)))
      .subscribe({
        next: () => void this.router.navigateByUrl(this.getReturnUrl()),
        error: () =>
          this.errorMessage.set(
            'No fue posible validar tus credenciales. Revisa los datos e intenta nuevamente.'
          ),
      });
  }

  protected hasError(controlName: 'idUser' | 'password', errorName: string): boolean {
    const control = this.loginForm.controls[controlName];

    return control.hasError(errorName) && (control.dirty || control.touched);
  }

  private getReturnUrl(): string {
    return this.route.snapshot.queryParamMap.get('returnUrl') || '/users';
  }
}
