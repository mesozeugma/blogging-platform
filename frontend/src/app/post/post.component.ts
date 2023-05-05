import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PostSchema } from '../shared/interfaces/post';
import { PostInfo } from '../shared/resolvers/post.resolver';
import { PostsService } from '../shared/services/posts.service';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css'],
})
export class PostComponent implements OnInit {
  post: PostSchema | undefined;
  canEditPost = false;

  constructor(
    private postsService: PostsService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.data.subscribe((data) => {
      const { post, canEdit }: PostInfo = data['postInfo'];
      this.canEditPost = canEdit;
      this.post = post;
    });
  }

  deletePost() {
    const postId = this.post?.id;
    if (!postId) return;
    this.postsService.delete(postId).subscribe(() => {
      this.router.navigate(['/posts']);
    });
  }
}
