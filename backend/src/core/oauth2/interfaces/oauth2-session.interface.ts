export interface OAuth2Session {
    authorization_code: string | null;
    code_challenge: string;
    start_ts: number;
}