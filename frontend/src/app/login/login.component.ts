import { Component } from '@angular/core';
import { NonNullableFormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../shared/services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  loginForm = this.formBuilder.group({
    username: ['', [Validators.required]],
    password: ['', [Validators.required]],
  });
  error = false;

  constructor(
    private userService: UserService,
    private router: Router,
    private formBuilder: NonNullableFormBuilder
  ) {}

  login() {
    const { username, password } = this.loginForm.value;
    if (!username || !password) return;
    this.userService.login(username, password).subscribe({
      next: () => {
        this.router.navigate(['/']);
      },
      error: () => {
        this.error = true;
      },
    });
  }
}
