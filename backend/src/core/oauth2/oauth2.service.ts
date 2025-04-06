import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

import { OAuth2Session } from './interfaces/oauth2-session.interface';
import { buffer } from 'stream/consumers';

const { randomBytes } = require('node:crypto');
@Injectable()
export class OAuth2Service {
    private sesssionStore: Map<string, OAuth2Session> = new Map();

    constructor() {
        setInterval(() => this.cleanUpExpiredSessions(), 60 * 1000); // Clean up expired sessions every minute
    }

    /**
     * Store the code_challenge in the session store and returns the session id
     * 
     * @param {string} challenge - The code challenge to store 
     * @param {string} redirectUri - The redirect uri to store
     * @returns {string} - The session id
     */
    public async startOAuth2Session(challenge: string, redirectUri: string): Promise<string> {
        const sessionId = uuidv4();
        
        this.sesssionStore.set(sessionId, {
            authorization_code: null,
            code_challenge: challenge,
            start_ts: Date.now()
        });

        return sessionId;
    }

    /**
     * Get the authorization code for the session.
     * 
     * @param {string} sessionId 
     * @returns {Promise<string>} - The authorization code 
     */
    public async getOAuth2AuthorizationCode(sessionId: string): Promise<string> {
        const authorization_code = await this.generateAuthorizationCode(); 
        const session = this.sesssionStore.get(sessionId);

        if (session) {
            session.authorization_code = authorization_code;
            this.sesssionStore.set(sessionId, session);

            return authorization_code;
        } else {
            throw new Error('Session not found');
        }
    }

    private async cleanUpExpiredSessions() {
        const expirationTime = 5 * 60 * 1000; // 5 minutes in milliseconds
        const now = Date.now();

        for (const [sessionId, session] of this.sesssionStore.entries()) {
            if (now - session.start_ts > expirationTime) {
                this.sesssionStore.delete(sessionId);
            }
        }
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