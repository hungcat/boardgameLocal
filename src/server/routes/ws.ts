import { Router } from "express";
import * as expressWs from "express-ws";
import { WrapWebSocketAdapter } from "../shared/WebSocket-adapter";
import { ChatApp } from "../shared/chat";

let router: any = Router();
expressWs(router);

/* GET users listing. */
router.ws('/', WrapWebSocketAdapter([new ChatApp()]));

export = router;
