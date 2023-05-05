import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PostInfo } from '../shared/resolvers/post.resolver';
import { PostsService } from '../shared/services/posts.service';

@Component({
  selector: 'app-post-edit',
  templateUrl: './post-edit.component.html',
  styleUrls: ['./post-edit.component.css'],
})
export class PostEditComponent {
  form = this.formBuilder.group({
    title: ['', { validators: [Validators.required] }],
    body: ['', { validators: [Validators.required] }],
  });
  postId = '';
  error = false;

  constructor(
    private postsService: PostsService,
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit() {
    this.route.parent?.data.subscribe((data) => {
      const { post, canEdit }: PostInfo = data['postInfo'];
      if (!canEdit) {
        this.router.navigate(['/posts', post.id]);
        return;
      }
      this.postId = post.id;
      this.form.setValue({
        title: post.title,
        body: post.body,
      });
    });
  }

  submitPost() {
    const { title, body } = this.form.value;
    if (!title || !body) return;
    this.postsService.update(this.postId, title, body).subscribe({
      next: (data) => {
        this.router.navigate(['/posts', data.id]);
      },
      error: () => {
        this.error = true;
      },
    });
  }
}
