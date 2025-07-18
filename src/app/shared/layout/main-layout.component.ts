import { Component, inject } from '@angular/core';
import { RouterOutlet, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '@core/auth.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { TokenService } from '@services/token.service';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [RouterOutlet, CommonModule, RouterModule],
  templateUrl: './main-layout.component.html'
})
export class MainLayoutComponent {
  private authService = inject(AuthService);
  private tokenService = inject(TokenService);
  private jwtHelper = new JwtHelperService();

  isManager = false;

  constructor() {
    const token = this.tokenService.get();
    if (token) {
      const decoded = this.jwtHelper.decodeToken(token);
      this.isManager = decoded?.isTeamLead === 'True';
    }
  }

  logout() {
    this.authService.logout();
  }
}
