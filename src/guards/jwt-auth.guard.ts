// src/auth/jwt-auth.guard.ts

import { Injectable } from '@nestjs/common';
import { ExecutionContext, CanActivate } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';
import { Observable } from 'rxjs';
import type { Request } from 'express';
import { Spotify_User } from 'src/users/models/user';
import { CookieService } from 'src/auth/cookie.service';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private cookieService: CookieService,
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request: Request & { user: Spotify_User } = context
      .switchToHttp()
      .getRequest();
    const token = this.cookieService.getTokenFromCookies(request);

    if (!token) {
      throw new UnauthorizedException('No access token provided');
    }
    try {
      const decoded = this.jwtService.verify<Spotify_User>(token);

      request.user = decoded;
      return true;
    } catch {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
