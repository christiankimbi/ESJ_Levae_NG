import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '@core/auth.service';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [RouterOutlet, CommonModule],
  template: `
    <nav class="navbar navbar-expand navbar-light bg-light px-3">
      <a class="navbar-brand" href="#">ESJ Leave</a>
      <div class="ms-auto">
        <button class="btn btn-outline-danger btn-sm" (click)="logout()">
          Logout
        </button>
      </div>
    </nav>

    <div class="p-3">
      <router-outlet />
    </div>
  `
})
export class MainLayoutComponent {
  private authService = inject(AuthService);

  logout() {
    this.authService.logout();
  }
}
