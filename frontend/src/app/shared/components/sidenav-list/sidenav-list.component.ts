import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-sidenav-list',
  templateUrl: './sidenav-list.component.html',
  styleUrls: ['./sidenav-list.component.css'],
})
export class SidenavListComponent {
  constructor(private userService: UserService, private router: Router) {}

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
