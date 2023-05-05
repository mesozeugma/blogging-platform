import { Component, ViewChild } from '@angular/core';
import {
  FormGroupDirective,
  NonNullableFormBuilder,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommentInfo } from '../shared/resolvers/comment.resolver';
import { CommentsService } from '../shared/services/comments.service';

@Component({
  selector: 'app-comment-edit',
  templateUrl: './comment-edit.component.html',
  styleUrls: ['./comment-edit.component.css'],
})
export class CommentEditComponent {
  postId = '';
  commentId = '';
  commentForm = this.formBuilder.group({
    body: ['', [Validators.required]],
  });
  @ViewChild(FormGroupDirective) commentFormGroup!: FormGroupDirective;
  error = false;

  constructor(
    private commentsService: CommentsService,
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: NonNullableFormBuilder
  ) {}

  ngOnInit(): void {
    this.route.data.subscribe((data) => {
      const { postId, comment, canEdit }: CommentInfo = data['commentInfo'];
      this.postId = postId;
      if (!canEdit) {
        this.navigateBackToPost();
      }
      this.commentId = comment.id;
      this.commentForm.setValue({
        body: comment.body,
      });
    });
  }

  navigateBackToPost() {
    this.router.navigate(['/posts', this.postId]);
  }

  submitComment() {
    const { body } = this.commentForm.value;
    if (!body) return;
    this.commentsService.update(this.postId, this.commentId, body).subscribe({
      next: () => {
        this.navigateBackToPost();
      },
      error: () => {
        this.error = true;
      },
    });
  }
}
