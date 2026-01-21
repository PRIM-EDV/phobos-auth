import { Body, Controller, Get, Post, Redirect, Req, Request, Res } from '@nestjs/common';
import { Response } from 'express';
import { SessionExpiredError } from 'src/app/common/error/session-expired.error';
import { UnauthorizedError } from 'src/app/common/error/unauthorized.error';

import { AuthService } from 'src/app/core/auth/auth.service';
import { OAuth2Service } from 'src/app/core/oauth2/oauth2.service';
import { WinstonLogger } from 'src/app/infrastructure/logger/winston/winston.logger';

import * as jose from 'jose';

@Controller('/auth/v1/')
export class AuthController {

    constructor(
        private readonly authService: AuthService,
        private readonly oauth2Service: OAuth2Service,
        private readonly logger: WinstonLogger
    ) {
        this.logger.setContext(this.constructor.name);
     }

    @Get('authorize')
    @Redirect('/auth/login', 302)
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
            const challenge = req.session?.authRequest?.challenge;
            if (!challenge) {
                throw new SessionExpiredError('Session expired.');
            }

            const user = await this.authService.validateUser(req.body.username, req.body.password);
            const code = await this.oauth2Service.generateAuthorizationCodeGrant(challenge, user.username, user.role);

            res.status(200).json({
                redirectTo: `${req.session.authRequest.redirectUri}?code=${code}&state=${req.session.authRequest.state}`
            })
        } catch (error) {
            switch(true) {
                case error instanceof SessionExpiredError:
                    this.logger.error(error.message);
                    return res.status(403).json({ message: error.message });
                case error instanceof UnauthorizedError:
                    this.logger.error(error.message);
                    return res.status(401).json({ message: `Invalid credentials for username: ${req.body?.username}` });
                default:
                    this.logger.error('Unknown error during login');
                    return res.status(500).json({ message: 'Internal server error' });
            }
        }
    }

    @Get('certs')
    async certs(@Res() res) {
        const publicKey = await jose.importSPKI(this.oauth2Service.publicKey, 'RS256');
        const jwk = await jose.exportJWK(publicKey);

        return res.status(200).json({
            keys: [
                jwk
            ]
        });
    }

    @Get('session')
    async session(@Req() req, @Res() res): Promise<boolean> {
        return res.status(200).json({session: req.session?.authRequest ? true : false});
    }


    @Post('token')
    async token(@Body() body, @Res() res: Response) {
        try {
            const { code, code_verifier } = body;
            const token = await this.oauth2Service.exchangeAuthorizationCodeGrant(code, code_verifier);
    
            return res.status(200).json({ access_token: token, token_type: 'Bearer' });   
        } catch (error) {
            this.logger.error(error.message);
            return res.status(401).json({ message: error.message });
        }
    }
}