import { Injectable } from "@angular/core";

import CryptoJS from "crypto-js";

@Injectable({
  providedIn: "root",
})
export class HashService {

  /**
 * Hash the given string using SHA-256.
 * 
 * @param {string} str - The string to hash
 * @returns {Promise<string>} - The hashed string
 */
  public async sha256(str: string): Promise<string> {
    const hash = await this.digest(new TextEncoder().encode(str));
    const hashArray = Array.from(new Uint8Array(hash));
    const hashHex = hashArray.map(b => ('00' + b.toString(16)).slice(-2)).join('');

    return hashHex;
  }

  /**
   * Digest the given data using SHA-256
   * 
   * @param data 
   * @returns 
   */
  private async digest(data: Uint8Array<ArrayBuffer>): Promise<ArrayBuffer> {
    if (crypto.subtle && typeof crypto.subtle.digest === 'function') {
      return crypto.subtle.digest('SHA-256', data);
    } else {
      const wordArray = CryptoJS.lib.WordArray.create(data);
      const hash = CryptoJS.SHA256(wordArray);
      const hashArray = new Uint8Array(hash.sigBytes);

      for (let i = 0; i < hash.sigBytes; i++) {
        hashArray[i] = (hash.words[i >>> 2] >>> (24 - (i % 4) * 8)) & 0xff;
      }
      return hashArray.buffer;
    }
  }
}
