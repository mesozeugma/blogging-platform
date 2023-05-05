import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormGroupDirective,
  NgForm,
  NonNullableFormBuilder,
  Validators,
} from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { Router } from '@angular/router';
import { catchError } from 'rxjs';
import { UserService } from '../shared/services/user.service';
import { passwordMatchValidator } from './validators/password-match.validator';

class CrossFieldErrorMatcher implements ErrorStateMatcher {
  isErrorState(
    control: FormControl | null,
    form: FormGroupDirective | NgForm | null
  ): boolean {
    return !!control?.dirty && !!form?.invalid;
  }
}

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
})
export class SignupComponent {
  signupForm = this.formBuilder.group(
    {
      username: ['', [Validators.required]],
      password1: ['', [Validators.required]],
      password2: ['', [Validators.required]],
    },
    { validators: passwordMatchValidator }
  );
  errorMatcher = new CrossFieldErrorMatcher();
  error = false;

  constructor(
    private userService: UserService,
    private router: Router,
    private formBuilder: NonNullableFormBuilder
  ) {}

  signup() {
    const { username, password1 } = this.signupForm.value;
    if (!username || !password1) return;
    this.userService.signup(username, password1).subscribe({
      next: () => {
        this.router.navigate(['/login']);
      },
      error: () => {
        this.error = true;
      },
    });
  }
}
