import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { readFileSync } from 'fs';

import * as jose from 'jose';

import { ROLES_METADATA } from '../constants';

const JWT_PUBLIC_KEY = readFileSync('/run/secrets/jwt_public_key', 'utf8');

/**
 * Guard that checks if the client is authorized to access the resource based on a JWT.
 */
@Injectable()
export class RolesGuard implements CanActivate {
  public readonly publicKey: string = JWT_PUBLIC_KEY;


  constructor() {}

  /**
   * Determines whether the client is authorized to access the resource.
   * @param context - The execution context containing the requesting client.
   * @returns A boolean indicating whether the client is authorized.
   * @throws UnauthorizedException if the client is not authorized.
   */
  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request.headers['authorization']?.split(' ')[1];
    const roles = Reflect.getMetadata(ROLES_METADATA, context.getHandler()) as string[];
    const publicKey = await jose.importSPKI(this.publicKey, 'RS256');

    await jose.jwtVerify(token, publicKey);

    if (!roles) {
      return true;
    }

    if (!token) {
      return false;
    } 

    try {
      const payload = jose.decodeJwt<{ scope?: string } & jose.JWTPayload>(token);

      if (!roles.includes(payload.scope)) {
        return false;
      }

    } catch {
      return false;
    }
    return true;
  }
}
