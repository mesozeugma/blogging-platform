import { Component } from '@angular/core';
import { Router } from '@angular/router';
import {
  BehaviorSubject,
  mergeMap,
  Observable,
  Subject,
  switchMap,
} from 'rxjs';
import { UserInfoSchema } from '../shared/interfaces/user';
import { UserService } from '../shared/services/user.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css'],
})
export class AdminComponent {
  private readonly refresh$ = new BehaviorSubject<void>(undefined);
  users$!: Observable<UserInfoSchema[]>;

  constructor(private userService: UserService, private router: Router) {}

  ngOnInit(): void {
    this.users$ = this.refresh$.pipe(
      mergeMap(() => this.userService.getUsers())
    );
  }

  isSelf(user: UserInfoSchema) {
    const userId = this.userService.getUser()?.id;
    return userId === user.id;
  }

  deleteUser(user: UserInfoSchema) {
    this.userService.deleteUser(user.id).subscribe({
      next: () => {
        this.refresh$.next();
      },
      error: () => {
        this.router.navigate(['/error', 'unknown']);
      },
    });
  }
}
