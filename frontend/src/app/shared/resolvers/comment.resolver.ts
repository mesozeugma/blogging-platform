import { Injectable } from '@angular/core';
import {
  Router,
  Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot,
} from '@angular/router';
import { catchError, EMPTY, map, Observable, of } from 'rxjs';
import { CommentSchema } from '../interfaces/comment';
import { CommentsService } from '../services/comments.service';
import { UserService } from '../services/user.service';

export interface CommentInfo {
  postId: string;
  comment: CommentSchema;
  canEdit: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class CommentResolver implements Resolve<CommentInfo> {
  constructor(
    private userService: UserService,
    private commentsService: CommentsService,
    private router: Router
  ) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<CommentInfo> {
    const postId = route.parent?.paramMap.get('postId');
    const commentId = route.paramMap.get('commentId');
    if (!postId || !commentId) {
      this.router.navigate(['/error', '404']);
      return EMPTY;
    }
    const user = this.userService.getUser();
    return this.commentsService.getOne(postId, commentId).pipe(
      catchError((err) => {
        console.log(err);
        this.router.navigate(['/error', 'unknown']);
        return EMPTY;
      }),
      map((comment) => {
        if (!user) {
          return { postId, comment, canEdit: false };
        }
        return {
          postId,
          comment,
          canEdit: user.isAdmin || user.id === comment.createdBy,
        };
      })
    );
  }
}
