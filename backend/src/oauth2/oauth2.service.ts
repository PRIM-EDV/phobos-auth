import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

import { OAuth2Session } from './interfaces/oauth2-session.interface';

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
     * @returns {string} - The session id
     */
    public async getOAuth2Session(challenge: string) {
        const sessionId = uuidv4();
        
        this.sesssionStore.set(sessionId, {
            code_challenge: challenge,
            start_ts: Date.now()
        });

        return sessionId;
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
}