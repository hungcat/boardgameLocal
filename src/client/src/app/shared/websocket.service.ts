import { Injectable, Inject, Optional }  from '@angular/core';

export const WSHOST = 'wsHost';
const defaultURL = 'ws://localhost:3000/ws';

@Injectable()
export class WebSocketService {
  private url: string;
  private _ws: WebSocket;
  private reconnectCount: number = 0;
  private autoReconnect: boolean = true;
  private messageQueue = [];
  private listeners = {
    'open': [],
    'message': [],
    'messageParsed': [],
    'close': [],
    'error': [],
  };

  constructor(@Inject(WSHOST) @Optional() url?: string) {
    this.url = url || defaultURL;
    this.reconnectCount = 0;
    this.connect(true);
  }

  connect(force: boolean = false) {
    if (!force && this._ws && this._ws.readyState !== WebSocketState.OPEN) {
      return;
    }

    this._ws = new WebSocket(this.url);
    this._ws.onopen = this.onOpen.bind(this);
    this._ws.onclose = this.onClose.bind(this);
    this._ws.onerror = this.onError.bind(this);
    this._ws.onmessage = this.onMessage.bind(this);
  }

  reconnect() {
    this.close();

    setTimeout(() => {
      console.log('Try to reconnect at ' + this.reconnectCount + 'th time.');
      this.connect();
    }, reconnectInterval(++this.reconnectCount));
  }

  close() {
    if (this._ws) {
      this._ws.close(1000);
      this._ws = null;
    }
  }


  /* inner listeners */

  private onOpen(e: Event) {
    //console.log(e);

    this.reconnectCount = 0;
    this.listeners.open.forEach(f => f(e));
    this.fireMessageQueue();
  }

  private onClose(e: CloseEvent) {
    //console.log(e);

    this.listeners.close.forEach(f => f(e));
    if (this.autoReconnect && e.code !== 1000) {
      this.reconnect();
    } else {
      this.messageQueue = [];
    }
  }

  private onError(e: ErrorEvent) {
    console.log(e);

    this.listeners.error.forEach(f => f(e));
  }

  private onMessage(e: MessageEvent) {
    console.log(e);

    this.listeners.message.forEach(f => f(e));

    if (e) {
      try {
        const o = JSON.parse(e.data);
        this.listeners.messageParsed.forEach(f => f(o.type, o.data));
      } catch (ex) {
        console.log(ex);
      }
    }
  }

  /* sender */

  send(data: string | any) {
    if (typeof data !== 'string') {
      data = JSON.stringify(data);
    }

    this.messageQueue.unshift(data);
    this.fireMessageQueue();
  }

  fireMessageQueue() {
    while (this.messageQueue.length && this.isOpened()) {
      this._ws.send(this.messageQueue.pop());
    }
  }

  // ?
  isState(state: string) {
    return this._ws && this._ws.readyState === WebSocketState[state];
  }

  isOpened() {
    return this._ws && this._ws.readyState === WebSocketState.OPEN;
  }


  /* addEventListener */
  on(eName: string, listener: Function) {
    let listeners = this.listeners[eName];
    if (listeners) listeners.push(listener);
  }
}

function reconnectInterval(k: number) {
  return Math.min(30, (Math.pow(2, k) - 1)) * 1000  * Math.random();
}

export enum WebSocketState {
  CONNECTING, OPEN, CLOSING, CLOSE
}

