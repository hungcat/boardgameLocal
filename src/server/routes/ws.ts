import { Router } from "express";
import * as expressWs from "express-ws";
import { WrapWebSocketAdapter } from "../shared/websocket-adapter";
import { BoardApp } from "../shared/board";

let router: any = Router();
expressWs(router);

/* GET users listing. */
router.ws('/', WrapWebSocketAdapter([new BoardApp()]));

export = router;
