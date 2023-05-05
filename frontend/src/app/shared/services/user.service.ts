import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, mergeMap, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  userInfoListSchema,
  UserInfoSchema,
  userInfoSchema,
} from '../interfaces/user';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  baseUrl = `${environment.apiBaseUrl}/users`;

  constructor(private http: HttpClient) {}

  login(username: string, password: string) {
    return this.http.post(`${this.baseUrl}/login`, { username, password }).pipe(
      mergeMap(() => {
        return this.http.get(`${this.baseUrl}/me`);
      }),
      map((body) => {
        const parse = userInfoSchema.safeParse(body);
        if (parse.success) {
          this.setUser(parse.data);
          return parse.data;
        }
        throw new Error('Invalid response');
      })
    );
  }

  logout() {
    return this.http.post(`${this.baseUrl}/logout`, null).pipe(
      map(() => {
        this.clearUser();
        return null;
      })
    );
  }

  getUsers(): Observable<UserInfoSchema[]> {
    return this.http.get(`${this.baseUrl}`).pipe(
      map((body) => {
        const parse = userInfoListSchema.safeParse(body);
        if (parse.success) {
          return parse.data.items;
        }
        throw new Error('Invalid response');
      })
    );
  }

  deleteUser(userId: string) {
    return this.http.delete(`${this.baseUrl}/${userId}`).pipe(map(() => null));
  }

  signup(username: string, password: string) {
    return this.http
      .post(`${this.baseUrl}/register`, { username, password })
      .pipe(map(() => null));
  }

  private setUser(user: UserInfoSchema) {
    localStorage.setItem('user', JSON.stringify(user));
  }

  clearUser() {
    localStorage.removeItem('user');
  }

  getUser(): UserInfoSchema | null {
    try {
      const user = localStorage.getItem('user');
      if (user) {
        return JSON.parse(user);
      }
      return null;
    } catch (e) {
      console.log(e);
      return null;
    }
  }

  isAdmin() {
    return !!this.getUser()?.isAdmin;
  }
}
