import { Controller, Get, Post, Req, Request, Res } from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from '../core/auth/auth.service';
import { OAuth2Service } from 'src/core/auth/oauth2.service';

@Controller('/auth')
export class AuthController {

    constructor(
        private readonly authService: AuthService,
        private readonly oauth2Service: OAuth2Service
    ) {}

    @Get('authorize')
    async authorize(@Req() req, @Res() res: Response) {
        req.session.authRequest = {
            "client_id": req.query.client_id,
            "redirect_uri": req.query.redirect_uri,
            "state": req.query.state,
            "code_challenge": req.query.code_challenge
        };

        res.redirect("/auth/login");
    }

    @Get('login')
    async login(@Request() req, @Res() res) {

    }

    @Post('login')
    async signIn(@Request() req, @Res() res: Response) {
        try {
            const user = await this.authService.validateUser(req.body.username, req.body.password);
            const authorization_code = this.oauth2Service.getOAuth2AuthorizationCode(req.cookies.session_id);

            res.redirect(`${req.session.authRequest.redirect_uri}?code=${authorization_code}&state=${req.session.authRequest.state}`);
            // return res.status(200).json({ authorization_code: authorization_code});
        } catch (error) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
    }

    @Get('certs')
    async certs(@Request() req) {
  
    }


    @Get('token')
    async token(@Request() req) {
        // Check coode challenge and redirect uri
    }
}