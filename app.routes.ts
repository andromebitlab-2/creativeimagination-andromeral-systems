import { Routes } from '@angular/router';
import { HomeComponent } from './src/app/pages/home/home.component';
import { PostDetailComponent } from './src/app/pages/post-detail/post-detail.component';
import { LoginComponent } from './src/app/pages/login/login.component';
import { CreatePostComponent } from './src/app/pages/create-post/create-post.component';
import { authGuard } from './src/app/guards/auth.guard';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'post/:id', component: PostDetailComponent },
  { path: 'login', component: LoginComponent },
  { 
    path: 'create', 
    component: CreatePostComponent,
    canActivate: [authGuard] 
  },
  { path: '**', redirectTo: '' }
];
