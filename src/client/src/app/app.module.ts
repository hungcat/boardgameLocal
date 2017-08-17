import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { UserRegistrationComponent } from './user-registration/user-registration.component';
import { BoardComponent } from './board/board.component';
import { CardComponent } from './board/items/card/card.component';
import { DeckComponent } from './board/items/deck/deck.component';
import { PlayerComponent } from './board/items/player/player.component';
import { AreaComponent } from './board/items/area/area.component';
import { AreaGeneratorComponent } from './board/items/area-generator/area-generator.component';

import { WebSocketService, WSHOST } from './shared/websocket.service';
import { ClientConfig } from "../config";

@NgModule({
  declarations: [
    AppComponent,
    UserRegistrationComponent,
    BoardComponent,
    CardComponent,
    DeckComponent,
    PlayerComponent,
    AreaComponent,
    AreaGeneratorComponent
  ],
  imports: [
    AppRoutingModule,
    BrowserModule,
    FormsModule
  ],
  providers: [
    WebSocketService,
    { provide: WSHOST, useValue: ClientConfig.wsHost }
  ],
  bootstrap: [AppComponent],
  entryComponents: [
    CardComponent,
    DeckComponent,
    PlayerComponent,
    AreaComponent,
    AreaGeneratorComponent
  ]
})
export class AppModule { }
