import { Body, Controller, Get, Post, Redirect, Req, Request, Res } from '@nestjs/common';
import { Response } from 'express';

import { AuthService } from 'src/core/auth/auth.service';
import { OAuth2Service } from 'src/core/oauth2/oauth2.service';
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
            "clientId": req.query.client_id,
            "redirectUri": req.query.redirect_uri,
            "state": req.query.state,
            "challenge": req.query.code_challenge
        };
    }

    @Post('login')
    async login(@Req() req, @Res() res: Response) {
        try {
            const challenge = req.session.authRequest.challenge;
            const user = await this.authService.validateUser(req.body.username, req.body.password);
            const code = await this.oauth2Service.generateAuthorizationCodeGrant(challenge, user.username, user.role);

            res.status(200).json({
                redirectTo: `${req.session.authRequest.redirectUri}?code=${code}&state=${req.session.authRequest.state}`
            })
        } catch (error) {
            this.logger.error('Error during login');
            return res.status(401).json({ message: 'Unauthorized' });
        }
    }

    @Get('certs')
    async certs(@Request() req) {
        const publicKey = this.oauth2Service.publicKey;
        return req.res.status(200).json({
            keys: [
                {
                    kty: 'RSA',
                    use: 'sig',
                    alg: 'RS256',
                    kid: '1',
                    n: publicKey,
                    e: 'AQAB'
                }
            ]
        });
    }

    @Get('session')
    async session(@Req() req, @Res() res): Promise<boolean> {
        return res.status(200).json({session: req.session ? true : false});
    }


    @Post('token')
    async token(@Body() body, @Res() res: Response) {
        const { code, code_verifier } = body;
        const token = await this.oauth2Service.exchangeAuthorizationCodeGrant(code, code_verifier);

        return res.status(200).json({ access_token: token, token_type: 'Bearer' });
    }
}