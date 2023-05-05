import { Component, OnInit } from '@angular/core';
import { map, Observable } from 'rxjs';
import { PostSchema } from '../shared/interfaces/post';
import { PostsService } from '../shared/services/posts.service';
import { UserService } from '../shared/services/user.service';

interface PostWithExtras extends PostSchema {
  canEdit: boolean;
  isFeatured: boolean;
}

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.css'],
})
export class PostsComponent implements OnInit {
  posts$!: Observable<PostWithExtras[]>;

  constructor(
    private postsService: PostsService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.posts$ = this.postsService.getPosts().pipe(
      map((posts) => {
        const user = this.userService.getUser();
        const isAdmin = !!user?.isAdmin;
        const userId = user?.id;
        return posts.map((post) => ({
          ...post,
          canEdit: isAdmin || userId === post.createdBy,
          isFeatured: this.isFeatured(post),
        }));
      })
    );
  }

  private isFeatured(post: PostSchema) {
    if (post.featuredUntil === undefined) return false;
    return post.featuredUntil >= new Date();
  }
}
