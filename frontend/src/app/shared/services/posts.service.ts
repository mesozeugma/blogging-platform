import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { postListScema, postSchema, PostSchema } from '../interfaces/post';

@Injectable({
  providedIn: 'root',
})
export class PostsService {
  baseUrl = `${environment.apiBaseUrl}/posts`;

  constructor(private http: HttpClient) {}

  private parsePost(body: unknown): PostSchema {
    const parse = postSchema.safeParse(body);
    if (parse.success) {
      return parse.data;
    }
    throw Error('Unexpected response');
  }

  getPosts(): Observable<PostSchema[]> {
    return this.http.get(this.baseUrl).pipe(
      map((body) => {
        const parse = postListScema.safeParse(body);
        if (parse.success) {
          return parse.data.items;
        }
        throw Error('Unexpected response');
      })
    );
  }

  getOne(postId: string): Observable<PostSchema> {
    return this.http.get(`${this.baseUrl}/${postId}`).pipe(map(this.parsePost));
  }

  create(title: string, body: string): Observable<PostSchema> {
    return this.http
      .post(this.baseUrl, { title, body })
      .pipe(map(this.parsePost));
  }

  update(postId: string, title: string, body: string): Observable<PostSchema> {
    return this.http
      .put(`${this.baseUrl}/${postId}`, { title, body })
      .pipe(map(this.parsePost));
  }

  delete(postId: string) {
    return this.http.delete(`${this.baseUrl}/${postId}`).pipe(map(() => null));
  }
}
