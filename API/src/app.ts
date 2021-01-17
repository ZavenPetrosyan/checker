import * as bodyParser from "body-parser";
import * as express from "express";
import * as uuid from "uuid";
import * as cookieParser from "cookie-parser";
import { CheckDomainController } from "./controllers/check_domain.controller";
import { broker } from "../common/base/baseModel";
import { QueueNames } from "../common/messaging/QueueTypesAndValues";


class Server {
    public app: express.Express;

    public static server(): Server {
        return new Server();
    }

    constructor() {
        this.app = express();
        this.config();
        this.routes();
        this.initBroker();
    }

    private config() {
        //mount json form parser
        this.app.use(bodyParser.json({ limit: "5mb" }));
        this.app.use(cookieParser());

        this.app.use(bodyParser.urlencoded({ extended: true }));
        // catch 404 and forward to error handler
        this.app.use(function(err: any, _req: express.Request, _res: express.Response, next: express.NextFunction) {
            err.status = 404;
            next(err);
        });

        this.app.use(function(_req, res, next) {
            // Website you wish to allow to connect
            res.setHeader("Access-Control-Allow-Origin", "*");
            // Request methods you wish to allow
            res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
            // Request headers you wish to allow
            res.setHeader("Access-Control-Allow-Headers", "X-Requested-With, Content-Type ,Authorization");
            // Allow access to pagination total count for client code
            res.setHeader("Access-Control-Expose-Headers", "X-Total-Count");
            // Set to true if you need the website to include cookies in the requests sent
            // to the API (e.g. in case you use sessions)
            res.setHeader("Access-Control-Allow-Credentials", "true");
            // Pass to next layer of middleware
            next();
        });
    }       

    private routes() {
        this.app.use("/domain", new CheckDomainController().router);
    }

    private async initBroker() {
        await broker.init();
        const queueName = QueueNames.API_WORKER;
        const callbackQueue = queueName + "-" + uuid.v4();
        broker.declareQueue(callbackQueue, { autoDelete: true });
        broker.callbackQueue = callbackQueue;
        broker.subscribe(callbackQueue, undefined, undefined, false);
    }

}

let server = Server.server();
module.exports = server.app;