import { Controller, Get, Request, Res } from '@nestjs/common';
import { Response } from 'express';

import { OAuth2Service } from 'src/oauth2/oauth2.service';

@Controller('api/oauth2')
export class OAuth2Controller {
  constructor(
    private readonly oauth2Service: OAuth2Service
  ) {}

  @Get('authorize')
  async authorize(@Request() req, @Res({ passthrough: true }) response: Response) {
    const codeChallenge = req.query.code_challenge;
    const redirectUri = req.query.redirect_uri; 

    if (typeof(codeChallenge) == 'string')  { 
      const sessionId = await this.oauth2Service.getOAuth2Session(req.query);
      return response.cookie('session_id', sessionId, { httpOnly: true, secure: true, sameSite: 'strict' })
    }
  }

  @Get('token')
  async token(@Request() req) {}


  @Get('certs')
  async certs(@Request() req) {}
}
