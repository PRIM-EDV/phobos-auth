import { Inject, Injectable } from '@nestjs/common';
import { randomBytes } from 'node:crypto';
import { readFileSync } from 'node:fs';

import * as jose from 'jose';

import { ICache } from '../common/interfaces/cache.interface';
import { OAuth2Session } from './interfaces/oauth2-session.interface';


const JWT_PUBLIC_KEY = readFileSync('/run/secrets/jwt_public_key', 'utf8');
const JWT_PRIVATE_KEY = readFileSync('/run/secrets/jwt_private_key', 'utf8');

@Injectable()
export class OAuth2Service {

    public readonly publicKey: string = JWT_PUBLIC_KEY;
    private readonly privateKey: string = JWT_PRIVATE_KEY;

    constructor(
        @Inject("Cache") private cache: ICache
    ) { }

    /**
     * Generate an authorization code grant using PKCE.
     * 
     * Generates a random authorization code and stores it in the cache with the associated session data. 
     * 
     * @param {string} challenge - The code challenge generated from the code verifier. 
     * @param {string} username - The username of the user requesting the authorization code. 
     * @param {string} scope - The scope of the authorization request. 
     * @returns {Promise<string>} - The generated authorization code.
     */
    public async generateAuthorizationCodeGrant(challenge: string, username: string, scope: string): Promise<string> {
        const code = await this.generateAuthorizationCode();
        const session = {
            username: username,
            challenge: challenge,
            scope: scope
        }

        await this.cache.set(code, session, 60 * 5); // 5 minutes expiration

        return code;
    }

    /**
     * Exchange the authorization code for an access token.
     * 
     * @param {string} code - The authorization code received from the client. 
     * @param {string} verifier - The code verifier used to generate the code challenge. 
     * @returns {Promise<string>} - The generated access token.
     */
    public async exchangeAuthorizationCodeGrant(code: string, verifier: string): Promise<string> {
        const session = await this.cache.get<OAuth2Session>(code);
        if (!session) {
            throw new Error('Invalid authorization code');
        }

        const isValid = await this.validateCodeChallenge(verifier, session.challenge);
        if (!isValid) {
            throw new Error('Invalid code verifier');
        }

        const accessToken = await this.generateAccessToken(session.username, session.scope);
        await this.cache.del(code);

        return accessToken;
    }

    /**
     * Validate the access token using JWT.
     * 
     * @param {string} token - The access token to validate.
     * @returns {Promise<boolean>} - True if the token is valid, false otherwise.
     */
    public async validateAccessToken(token: string): Promise<boolean> {
        const publicKey = await jose.importSPKI(this.publicKey, 'RS256');

        try {
            await jose.jwtVerify(token, publicKey);
            return true;
        } catch (error) {
            return false;
        }
    }

    /**
     * Generate an access token using JWT.
     * 
     * @param {string} sub - The subject of the token (usually the user ID).
     * @param {string} scope - The scope of the token (permissions granted).
     * @returns {Promise<string>} - The generated access token.
     */
    private async generateAccessToken(sub: string, scope: string): Promise<string> {
        const token = {
            iss: ``,
            sub: sub,
            aud: [],
            exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24),
            iat: Math.floor(Date.now() / 1000),
            scope: scope,
        }
        const privateKey = await jose.importPKCS8(this.privateKey, 'RS256');
        
        return await new jose.SignJWT(token).setProtectedHeader({ alg: 'RS256' }).sign(privateKey);
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

    /**
     * Generate a code challenge using SHA-256 hashing.
     * 
     * @param {string} codeVerifier - The code verifier used to generate the code challenge.
     * @returns {Promise<string>} - The generated code challenge.
     */
    private async generateCodeChallenge(codeVerifier: string): Promise<string> {
        const encoder = new TextEncoder();
        const encodedVerifier = encoder.encode(codeVerifier);

        // SHA-256 Hashing
        const hashBuffer = await crypto.subtle.digest('SHA-256', encodedVerifier);
        const base64url = btoa(String.fromCharCode(...new Uint8Array(hashBuffer))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');

        return base64url;
    }

    /**
     * Validate the code challenge against the code verifier.
     * 
     * @param {string} verifier - The code verifier used to generate the code challenge.
     * @param {string} challenge - The code challenge received from the client.
     * @returns {Promise<boolean>} - True if the code challenge is valid, false otherwise.
     */
    public async validateCodeChallenge(verifier: string, challenge: string): Promise<boolean> {
        const generatedChallenge = await this.generateCodeChallenge(verifier);
        return generatedChallenge === challenge;
    }
}