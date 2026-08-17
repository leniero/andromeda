import { Routes } from '@angular/router';
import { WelcomeComponent } from './components/welcome/welcome';
import { HomeComponent } from './components/home/home';
import { EmotionListComponent } from './components/emotion-list/emotion-list';
import { LoginComponent } from './components/login/login';
import { SignupComponent } from './components/signup/signup';
import { MyAccountComponent } from './components/my-account/my-account';
import { ChangePasswordComponent } from './components/change-password/change-password';
import { authGuard } from './guards/auth-guard';

export const routes: Routes = [
  { path: '', component: WelcomeComponent },
  { path: 'home', component: HomeComponent },
  { path: 'emotion-list', component: EmotionListComponent },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'my-account', component: MyAccountComponent, canActivate: [authGuard] },
  { path: 'change-password', component: ChangePasswordComponent, canActivate: [authGuard] },
  { path: '**', redirectTo: '' }
];
