import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { UserRegistrationComponent } from './user-registration/user-registration.component';
import { ChatComponent } from './chat/chat.component';
import { BoardComponent } from './board/board.component';
import { DraggableItemComponent } from './board/items/draggable-item/draggable-item.component';

@NgModule({
  declarations: [
    AppComponent,
    UserRegistrationComponent,
    ChatComponent,
    BoardComponent,
    DraggableItemComponent
  ],
  imports: [
    AppRoutingModule,
    BrowserModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
