import createError from 'http-errors';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import { getRoutersSync, getAllRouters } from './utils/getRouter.js';

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const __routes_dir = path.join(__dirname, 'routes');

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
    return res.status(200).json({});
  }
  next();
});

try {
  const routers = await getAllRouters(__routes_dir);
  
  for (const mainRoute in routers) {
    for (const subRoute in routers[mainRoute]) {
      try {
        const routerPath = routers[mainRoute][subRoute];
        
        const routerModule = await import(routerPath);
        if (routerModule.default) {
          const routePrefix = `${mainRoute === '/' ? '' : mainRoute}/${subRoute}`;
          app.use(routePrefix, routerModule.default);
        } else {
          console.error(`Module at ${routerPath} does not export an Express router!`);
        }
      } catch (error) {
        console.error(`Error loading router ${mainRoute}/${subRoute}:`, error);
      }
    }
  }
} catch (error) {
  console.error("Failed to load routers:", error);
}

// Catch 404 and forward to error handler
app.use(function(req, res, next) {
  // If it's an API request, return JSON instead
  if (req.headers['content-type'] === 'application/json' ||
    (req.headers['authorization'] && req.headers['authorization'].toLowerCase().includes('bearer '))) {
    return res.status(404).json({
      status: false,
      error: "Sorry can't find this route!"
    });
  } else {
    next(createError(404));
  }
});

// Error handler
app.use(function(err, req, res, next) {
  // Set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // Render the error page
  res.status(err.status || 500);
  res.render('error');
});

export default app;