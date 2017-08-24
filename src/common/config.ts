const port: string = '3000';

export module ClientConfig {
  export const wsHost: string = 'ws://localhost:' + port + '/ws';
};

export module ServerConfig {
  export const serverPort: string = port;
  export const isHTTPS: boolean = false;
  export const httpsKey: string = '';
  export const httpsCert: string = '';
};
