import { CorsOptions } from 'cors';

var allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || [];

const corsOptions: CorsOptions = {
  origin: function (origin, callback) {
    if (allowedOrigins.length === 0 || !origin) return callback(null, true);

    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }

    return callback(null, true);
  }
}

export {
  corsOptions
}