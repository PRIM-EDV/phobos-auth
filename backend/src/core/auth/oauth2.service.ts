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
     * Generate a random size 64 string as authorization code.
     * 
     * @returns {Promise<string>} - The generated authorization code
     */
    public async generateAuthorizationCode(): Promise<string> {
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