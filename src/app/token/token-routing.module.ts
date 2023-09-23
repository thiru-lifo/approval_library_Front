import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TokenUserComponent } from './token-user/token-user.component';

const routes: Routes = [{ path: 'token_users', component: TokenUserComponent , data: { breadcrumb: 'Token user'}}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TokenRoutingModule { }
