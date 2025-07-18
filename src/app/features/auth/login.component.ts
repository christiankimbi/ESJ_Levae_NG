import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '@core/auth.service';
import { Router } from '@angular/router';
import { NotificationService } from '@shared/utils/notification.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html'
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  public notification = inject(NotificationService);

  form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required]
  });

  onSubmit() {
    if (this.form.invalid) return;

    this.authService.login(this.form.getRawValue()).subscribe({
      next: () => {
        this.notification.show('Login successful', 'success');
        this.router.navigateByUrl('/leave');
      },
      error: () => {
        this.notification.show('We could not log you in, please check your credentials and try again/', 'danger');
      }
    });
  }
}
