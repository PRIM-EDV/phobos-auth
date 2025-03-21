import { Controller, Get, Request } from '@nestjs/common';

@Controller('api/oauth2')
export class OAuth2ApiController {
  constructor() {}

  @Get('authorize')
  async authorize(@Request() req) {}

  @Get('token')
  async token(@Request() req) {}

  @Get('certs')
  async certs(@Request() req) {}
}
