import { Router } from "express";
import * as expressWs from "express-ws";
import { WebSocketAdapter } from "../shared/WebSocket-adapter";

let router: any = Router();
expressWs(router);

/* GET users listing. */
router.ws('/', new WebSocketAdapter().exportOnConnection());

export = router;
