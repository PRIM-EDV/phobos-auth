import { Injectable } from '@nestjs/common';
import { randomBytes } from 'node:crypto';
import { readFileSync } from 'node:fs';

const JWT_PUBLIC_KEY = readFileSync('/run/secrets/jwt_private_key', 'utf8');
const JWT_PRIVATE_KEY = readFileSync('/run/secrets/jwt_public_key', 'utf8');


@Injectable()
export class OAuth2Service {

    constructor() {
    }

    /**
     * Get the authorization code for the session.
     * 
     * @param {string} sessionId 
     * @returns {Promise<string>} - The authorization code 
     */
    public async getOAuth2AuthorizationCode(sessionId: string): Promise<string> {
        const authorization_code = await this.generateAuthorizationCode(); 
        // const session = this.sesssionStore.get(sessionId);

        // if (session) {
        //     session.authorization_code = authorization_code;
        //     this.sesssionStore.set(sessionId, session);

        //     return authorization_code;
        // } else {
        //     throw new Error('Session not found');
        // }
        return 
    }

    /**
     * Generate a random size 64 string as authorization code.
     * 
     * @returns {Promise<string>} - The generated authorization code
     */
    private async generateAuthorizationCode(): Promise<string> {
        return new Promise((resolve, reject) => {
            randomBytes(64, (error, buffer) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(buffer.toString('hex'));
                }
            })
        });
    }
}