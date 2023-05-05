import { Injectable } from '@angular/core';
import {
  Router,
  Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot,
} from '@angular/router';
import { catchError, EMPTY, map, Observable } from 'rxjs';
import { PostSchema } from '../interfaces/post';
import { PostsService } from '../services/posts.service';
import { UserService } from '../services/user.service';

export interface PostInfo {
  post: PostSchema;
  canEdit: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class PostResolver implements Resolve<PostInfo> {
  constructor(
    private userService: UserService,
    private postsService: PostsService,
    private router: Router
  ) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<PostInfo> {
    const postId = route.paramMap.get('postId');
    if (!postId) {
      this.router.navigate(['/error', '404']);
      return EMPTY;
    }
    const user = this.userService.getUser();
    return this.postsService.getOne(postId).pipe(
      catchError((err) => {
        console.log(err);
        this.router.navigate(['/error', 'unknown']);
        return EMPTY;
      }),
      map((post) => {
        if (!user) {
          return { post, canEdit: false };
        }
        return {
          post,
          canEdit: user.isAdmin || user.id === post.createdBy,
        };
      })
    );
  }
}
