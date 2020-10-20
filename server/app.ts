import { json, urlencoded } from "body-parser"
import * as compression from "compression"
import * as express from "express"
import * as path from "path"
import * as config from "config"
import * as cookieParser from "cookie-parser"
import * as jwt from "express-jwt"
import * as jwksRsa from "jwks-rsa"
import * as cors from "cors"
import * as fs from "fs-extra"
import * as morgan from "morgan"
const rfs = require("rotating-file-stream")

import { versionsRouter } from "./routes/versions"
import { categoriesRouter } from "./routes/categories"
import { categoryRouter } from "./routes/category"
import { feedsRouter } from "./routes/feeds"
import { feedRouter } from "./routes/feed"
import { itemsRouter } from "./routes/items"
import { itemRouter } from "./routes/item"
import { opmlRouter } from "./routes/opml"

const app: express.Application = express();

const log_conf = config.get('log')
if (!!!log_conf['path']) {
    console.log('log dir not defined in config, please check');
    process.exit(1)
}
if (!fs.existsSync(log_conf['path'])) {
    console.log('missing log directory: '+log_conf['dir'])
    process.exit(1)
}

const log_stream = rfs.createStream('access.log', log_conf)

const auth_conf = config.get('auth')
const authCheck = jwt({
    secret: jwksRsa.expressJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: 'https://'+auth_conf['AUTH0_DOMAIN']+'/.well-known/jwks.json'
    }),
    audience: auth_conf['AUTH0_CLIENT_ID'],
    issuer: 'https://'+auth_conf['AUTH0_DOMAIN']+'/',
    algorithms: ['RS256']
});


app.disable("x-powered-by");

app.use(json())
app.use(compression())
app.use(urlencoded({ extended: true }))
app.use(cookieParser())
app.use(morgan(':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent" :response-time ms', {stream: log_stream}))

// api routes
app.use("/api/versions", authCheck, versionsRouter)
app.use("/api/categories", authCheck, categoriesRouter)
app.use("/api/category", authCheck, categoryRouter)
app.use("/api/feeds", authCheck, feedsRouter)
app.use("/api/feed", authCheck, feedRouter)
app.use("/api/items", authCheck, itemsRouter)
app.use("/api/item", authCheck, itemRouter)
app.use("/api/opml", authCheck, opmlRouter)

if (app.get("env") === "production") {

  // in production mode run application from dist folder
  app.use(express.static(path.join(__dirname, "/../client")));
}

// catch 404 and forward to error handler
app.use((req: express.Request, res: express.Response, next) => {
    const err = new Error("Not Found");
    next(err);
});

// production error handler
// no stacktrace leaked to user
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {

  res.status(err.status || 500);
  res.json({
    error: {},
    message: err.message,
  });
});

export { app };
