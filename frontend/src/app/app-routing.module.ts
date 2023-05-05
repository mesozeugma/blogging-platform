import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './admin/admin.component';
import { CommentEditComponent } from './comment-edit/comment-edit.component';
import { ErrorComponent } from './error/error.component';
import { LoginComponent } from './login/login.component';
import { PostCreateComponent } from './post-create/post-create.component';
import { PostEditComponent } from './post-edit/post-edit.component';
import { PostViewComponent } from './post-view/post-view.component';
import { PostComponent } from './post/post.component';
import { PostsComponent } from './posts/posts.component';
import { IsAdminGuard } from './shared/guards/is-admin.guard';
import { IsGuestGuard } from './shared/guards/is-guest.guard';
import { IsLoggedInGuard } from './shared/guards/is-logged-in.guard';
import { CommentResolver } from './shared/resolvers/comment.resolver';
import { PostResolver } from './shared/resolvers/post.resolver';
import { SignupComponent } from './signup/signup.component';

const routes: Routes = [
  { path: '', redirectTo: 'posts', pathMatch: 'full' },
  { path: 'posts', component: PostsComponent },
  {
    path: 'posts/:postId',
    component: PostComponent,
    resolve: { postInfo: PostResolver },
    children: [
      {
        path: '',
        component: PostViewComponent,
      },
      {
        path: 'edit',
        component: PostEditComponent,
        canActivate: [IsLoggedInGuard],
      },
      {
        path: 'comment-edit/:commentId',
        component: CommentEditComponent,
        canActivate: [IsLoggedInGuard],
        resolve: { commentInfo: CommentResolver },
      },
    ],
    runGuardsAndResolvers: 'always',
  },
  {
    path: 'post-create',
    component: PostCreateComponent,
    canActivate: [IsLoggedInGuard],
  },
  { path: 'login', component: LoginComponent, canActivate: [IsGuestGuard] },
  { path: 'signup', component: SignupComponent, canActivate: [IsGuestGuard] },
  { path: 'admin', component: AdminComponent, canActivate: [IsAdminGuard] },
  { path: 'error/:errorCode', component: ErrorComponent },
  { path: '**', redirectTo: '/error/404' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
