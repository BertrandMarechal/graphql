import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UsersComponent } from './components/users/users.component';
import { UserComponent } from './components/users/user/user.component';

const routes: Routes = [{
  path: 'users',
  component: UsersComponent,
  children: [{
    path: ':id',
    component: UserComponent
  }]
}, {
  path: '',
  pathMatch: 'full',
  redirectTo: '/users'
}];

@NgModule({
  imports: [
    RouterModule.forRoot(routes),
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
