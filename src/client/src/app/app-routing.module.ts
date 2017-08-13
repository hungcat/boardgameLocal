import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ChatComponent } from './chat/chat.component';
import { BoardComponent } from './board/board.component';
import { UserRegistrationComponent } from './user-registration/user-registration.component';

const routes: Routes = [
  { path: '', redirectTo: 'board', pathMatch: 'full' },
  { path: 'chat', component: ChatComponent },
  { path: 'board', component: BoardComponent },
  { path: 'login', component: UserRegistrationComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
