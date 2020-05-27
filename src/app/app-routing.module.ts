import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent }  from  './pages/login/login.component'
import { HomeComponent } from './pages/home/home.component'
import { AngularFireAuthGuard, redirectUnauthorizedTo,redirectLoggedInTo } from '@angular/fire/auth-guard';

const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo(['login']);
const redirectLoggedInToItems = () => redirectLoggedInTo(['']);

const routes: Routes = [
  {path:"login", component:LoginComponent, canActivate:[AngularFireAuthGuard], data:{authGuardPipe:redirectLoggedInToItems}},
  {path:"", component:HomeComponent, canActivate:[AngularFireAuthGuard], data: { authGuardPipe: redirectUnauthorizedToLogin } }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
