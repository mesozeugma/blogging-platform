import { Component } from '@angular/core';
import { NonNullableFormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { PostsService } from '../shared/services/posts.service';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css'],
})
export class PostCreateComponent {
  form = this.formBuilder.group({
    title: ['', [Validators.required]],
    body: ['', [Validators.required]],
  });
  error = false;

  constructor(
    private postsService: PostsService,
    private router: Router,
    private formBuilder: NonNullableFormBuilder
  ) {}

  submitPost() {
    const { title, body } = this.form.value;
    if (!title || !body) return;
    this.postsService.create(title, body).subscribe({
      next: (data) => {
        this.router.navigate(['/posts', data.id]);
      },
      error: () => {
        this.error = true;
      },
    });
  }
}
