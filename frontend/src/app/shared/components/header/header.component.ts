import { Component, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent {
  @Output() sidenavToggle = new EventEmitter<void>();

  constructor(private userService: UserService, private router: Router) {}

  onToggleSidenav() {
    this.sidenavToggle.emit();
  }

  logout() {
    this.userService.logout().subscribe({
      next: () => {
        this.router.navigate(['/login']);
      },
      error: () => {
        this.router.navigate(['/error', 'unknown']);
      },
    });
  }

  isUser() {
    return !!this.userService.getUser();
  }

  isAdmin() {
    return !!this.userService.getUser()?.isAdmin;
  }
}
