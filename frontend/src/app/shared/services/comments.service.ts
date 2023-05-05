import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  commentListScema,
  CommentSchema,
  commentSchema,
} from '../interfaces/comment';

@Injectable({
  providedIn: 'root',
})
export class CommentsService {
  createUrl(postId: string, commentId: string | undefined) {
    const url = `${environment.apiBaseUrl}/posts/${postId}/comments`;
    if (commentId !== undefined) {
      return `${url}/${commentId}`;
    }
    return url;
  }

  constructor(private http: HttpClient) {}

  private parseComment(body: unknown): CommentSchema {
    const parse = commentSchema.safeParse(body);
    if (parse.success) {
      return parse.data;
    }
    throw new Error('Invalid response');
  }

  getAll(postId: string): Observable<CommentSchema[]> {
    return this.http.get(this.createUrl(postId, undefined)).pipe(
      map((body) => {
        const parse = commentListScema.safeParse(body);
        if (parse.success) {
          return parse.data.items;
        }
        throw new Error('Invalid response');
      })
    );
  }

  create(postId: string, body: string): Observable<CommentSchema> {
    return this.http
      .post(this.createUrl(postId, undefined), { body })
      .pipe(map(this.parseComment));
  }

  getOne(postId: string, commentId: string): Observable<CommentSchema> {
    return this.http
      .get(this.createUrl(postId, commentId))
      .pipe(map(this.parseComment));
  }

  update(
    postId: string,
    commentId: string,
    body: string
  ): Observable<CommentSchema> {
    return this.http
      .put(this.createUrl(postId, commentId), { body })
      .pipe(map(this.parseComment));
  }

  delete(postId: string, commentId: string) {
    return this.http
      .delete(this.createUrl(postId, commentId))
      .pipe(map(() => null));
  }
}
