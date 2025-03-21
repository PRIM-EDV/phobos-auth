import { Controller, Get, Request } from '@nestjs/common';

@Controller('api')
export class TokenApiController {
  constructor() {}

  @Get('token')
  async login(@Request() req) {
    // return this.authService.login(req.user);
  }
}
