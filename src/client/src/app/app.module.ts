import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { UserRegistrationComponent } from './user-registration/user-registration.component';
import { ChatComponent } from './chat/chat.component';
import { BoardComponent } from './board/board.component';
import { DraggableItemComponent } from './board/items/draggable-item/draggable-item.component';
import { CardComponent } from './board/items/card/card.component';
import { DeckComponent } from './board/items/deck/deck.component';
import { PlayerComponent } from './board/items/player/player.component';
import { AreaComponent } from './board/items/area/area.component';
import { DraggableOptionsProvider } from './board/items/shared/board-item.base';

@NgModule({
  declarations: [
    AppComponent,
    UserRegistrationComponent,
    ChatComponent,
    BoardComponent,
    DraggableItemComponent,
    CardComponent,
    DeckComponent,
    PlayerComponent,
    AreaComponent
  ],
  imports: [
    AppRoutingModule,
    BrowserModule,
    FormsModule
  ],
  providers: [ DraggableOptionsProvider ],
  bootstrap: [AppComponent],
  entryComponents: [ AreaComponent ]
})
export class AppModule { }
