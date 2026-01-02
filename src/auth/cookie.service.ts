// src/auth/cookie.service.ts

import { Injectable } from '@nestjs/common';
import type { Response, Request } from 'express';

@Injectable()
export class CookieService {
  setCookie(res: Response, token: string) {
    res.cookie('jwt', token, {
      httpOnly: true,
      sameSite: 'none',
      maxAge: 60 * 60 * 1000,
      secure: process.env.NODE_ENV === 'production',
    });
  }

  getTokenFromCookies(req: Request): string | undefined {
    const access_token = req.headers.cookie
      ?.split(';')
      .find((c) => c.startsWith('jwt='))
      ?.split('=')[1];

    return access_token;
  }

  clearCookie(res: Response) {
    res.clearCookie('jwt');
  }
}
