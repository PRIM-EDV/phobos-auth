import { Controller, Get, Post, Request, Res } from '@nestjs/common';
import { AuthService } from '../core/auth/auth.service';
import { OAuth2Service } from 'src/core/oauth2/oauth2.service';

@Controller('/auth')
export class AuthController {

    constructor(
        private readonly authService: AuthService,
        private readonly oauth2Service: OAuth2Service
    ) {}

    @Post('login')
    async login(@Request() req, @Res() res) {
        try {
            const user = await this.authService.validateUser(req.body.username, req.body.password);
            const authorization_code = this.oauth2Service.getOAuth2AuthorizationCode(req.cookies.session_id);

            return res.status(200).json({ authorization_code: authorization_code});
        } catch (error) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
    }

    @Get('token')
    async token(@Request() req) {
        // Check coode challenge and redirect uri
    }
}