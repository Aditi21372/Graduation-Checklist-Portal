import { JwtPayload } from 'jsonwebtoken';
import { Request } from 'express';

interface User {
  userId: string;
  role: string;
}

declare module 'express-serve-static-core' {
  interface Request {
    user?: User & JwtPayload;
  }
}
