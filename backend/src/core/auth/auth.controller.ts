import { Controller, Get, Post, Request, Res } from '@nestjs/common';

@Controller('/auth')
export class AuthController {

    @Post('login')
    async login(@Request() req) {}

    @Get('token')
    async token(@Request() req) {}
}