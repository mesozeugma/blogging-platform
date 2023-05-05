import { Component, ViewChild } from '@angular/core';
import {
  FormGroupDirective,
  NonNullableFormBuilder,
  Validators,
} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subject, switchMap } from 'rxjs';
import { CommentSchema } from '../shared/interfaces/comment';
import { PostInfo } from '../shared/resolvers/post.resolver';
import { CommentsService } from '../shared/services/comments.service';
import { UserService } from '../shared/services/user.service';

@Component({
  selector: 'app-post-view',
  templateUrl: './post-view.component.html',
  styleUrls: ['./post-view.component.css'],
})
export class PostViewComponent {
  private readonly refresh$ = new Subject<void>();
  postId = '';
  comments: CommentSchema[] = [];
  commentForm = this.formBuilder.group({
    body: ['', [Validators.required]],
  });
  @ViewChild(FormGroupDirective) commentFormGroup!: FormGroupDirective;
  error = false;

  constructor(
    private commentsService: CommentsService,
    private userService: UserService,
    private route: ActivatedRoute,
    private formBuilder: NonNullableFormBuilder
  ) {}

  ngOnInit(): void {
    this.route.data.subscribe((data) => {
      const { post }: PostInfo = data['postInfo'];
      this.postId = post.id;
      this.comments = post.comments || [];
    });
    this.refresh$
      .pipe(
        switchMap(() => {
          return this.commentsService.getAll(this.postId);
        })
      )
      .subscribe({
        next: (comments) => {
          this.comments = comments;
        },
      });
  }

  getUser() {
    return this.userService.getUser();
  }

  canEditComment(comment: CommentSchema) {
    const user = this.getUser();
    if (!user) return false;
    return user.isAdmin || user.id === comment.createdBy;
  }

  isLoggedIn() {
    return !!this.getUser();
  }

  submitComment() {
    const { body } = this.commentForm.value;
    if (!body) return;
    this.commentsService.create(this.postId, body).subscribe({
      next: () => {
        this.refresh$.next();
        this.commentFormGroup.resetForm();
      },
      error: () => {
        this.error = true;
      },
    });
  }

  deleteComment(commentId: string) {
    this.commentsService.delete(this.postId, commentId).subscribe(() => {
      this.refresh$.next();
    });
  }
}
