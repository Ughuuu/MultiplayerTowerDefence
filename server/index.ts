import * as express from 'express';
import { RouteManager } from './routes/index';
import { RoomManager } from './rooms/index';
import { AppConstants } from './constants/app.const';
import { ProcessManager } from './process/index'
import { createServer } from 'http';

const app = express();
const httpServer = createServer(app);

RouteManager.init(app);
RoomManager.init(httpServer);

httpServer.listen(AppConstants.port, () =>{
    console.log(`Listening on http://localhost:${ AppConstants.port }`);
});

