import { Controller, Get, Post, Redirect, Req, Request, Res } from '@nestjs/common';
import { Response } from 'express';

import { AuthService } from 'src/core/auth/auth.service';
import { OAuth2Service } from 'src/core/auth/oauth2.service';
import { WinstonLogger } from 'src/infrastructure/logger/winston/winston.logger';

@Controller('/auth')
export class AuthController {

    constructor(
        private readonly authService: AuthService,
        private readonly oauth2Service: OAuth2Service,
        private readonly logger: WinstonLogger
    ) {
        this.logger.setContext(this.constructor.name);
     }

    @Get('authorize')
    @Redirect('/login', 302)
    async authorize(@Req() req, @Res() res: Response) {
        req.session.authRequest = {
            "client_id": req.query.client_id,
            "redirect_uri": req.query.redirect_uri,
            "state": req.query.state,
            "code_challenge": req.query.code_challenge
        };
    }

    @Post('login')
    async login(@Req() req, @Res() res: Response) {
        try {
            const user = await this.authService.validateUser(req.body.username, req.body.password);
            const authorization_code = await this.oauth2Service.generateAuthorizationCode();

            req.session.code = authorization_code;
            res.status(200).json({
                redirectTo: `${req.session.authRequest.redirect_uri}?code=${authorization_code}&state=${req.session.authRequest.state}`
            })
        } catch (error) {
            this.logger.error('Error during login', error);
            return res.status(401).json({ message: 'Unauthorized' });
        }
    }

    @Get('certs')
    async certs(@Request() req) {

    }

    @Get('session')
    async session(@Request() req, @Res() res): Promise<boolean> {
        return res.status(200).json({session: req.session ? true : false});
    }


    @Get('token')
    async token(@Request() req) {

    }
}