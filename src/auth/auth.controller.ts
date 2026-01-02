import {
  Controller,
  Get,
  Post,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { CookieService } from './cookie.service';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';

@Controller('auth/spotify')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly cookieService: CookieService,
  ) {}

  @Post('login')
  login(@Res() res: Response) {
    const url = this.authService.getSpotifyAuthUrl();

    return res.redirect(url);
  }

  @Post('logout')
  logout(@Res() res: Response) {
    this.cookieService.clearCookie(res);

    return res.redirect(`${process.env.FRONTEND_URL}/login`);
  }

  @Get('callback')
  async callback(@Query('code') code: string, @Res() res: Response) {
    if (!code) return res.status(400).send('Missing code');

    const tokens = await this.authService.exchangeCodeForToken(code);

    const user = await this.authService.saveUserTokens(tokens);

    const jwt = this.authService.createJwtToken(user);

    this.cookieService.setCookie(res, jwt);

    return res.redirect(`${process.env.FRONTEND_URL}/stats`);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  getMe(@Req() req: Request & { user: unknown }) {
    return { user: req.user };
  }
}
