import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '@core/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="d-flex justify-content-center align-items-center min-vh-100 bg-light">
      <div class="card shadow p-4" style="width: 100%; max-width: 400px;">
        <h4 class="mb-3 text-center">ESJ Leave Login</h4>

        <form [formGroup]="form" (ngSubmit)="onSubmit()">
          <div class="mb-3">
            <label for="email" class="form-label">Email</label>
            <input
              type="email"
              formControlName="email"
              class="form-control"
              [class.is-invalid]="form.get('email')?.invalid && form.get('email')?.touched"
              id="email"
            />
            <div class="invalid-feedback">Valid email is required</div>
          </div>

          <div class="mb-3">
            <label for="password" class="form-label">Password</label>
            <input
              type="password"
              formControlName="password"
              class="form-control"
              [class.is-invalid]="form.get('password')?.invalid && form.get('password')?.touched"
              id="password"
            />
            <div class="invalid-feedback">Password is required</div>
          </div>

          <button type="submit" class="btn btn-primary w-100" [disabled]="form.invalid">
            Login
          </button>
        </form>
      </div>
    </div>
  `
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required]
  });

  onSubmit() {
    if (this.form.invalid) return;

    this.authService.login(this.form.getRawValue()).subscribe({
      next: () => this.router.navigateByUrl('/leave'),
      error: () => alert('Invalid credentials or server error')
    });
  }
}
