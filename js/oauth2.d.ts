export interface ClientAppSettings {
    client_id: string;
    redirect_uri?: string;
    client_secret?: string;
}
export interface AccessToken {
    token_type: string;
    access_token: string;
}
export interface Access extends AccessToken {
    refresh_token?: string;
    instance_url?: string;
}
export declare type TokenGrantType = "password" | "refresh_token" | "authorization_code";
export interface TokenGrantParams extends ClientAppSettings {
    grant_type: TokenGrantType;
    code?: string;
    refresh_token?: string;
    username?: string;
    password?: string;
}
export declare type AuthResponseType = "code" | "token";
export interface AuthorizationWorkflowParams {
    response_type: AuthResponseType;
    client_id: string;
    redirect_uri: string;
    state?: string;
}
export interface TokenGrantOptions {
    url: string;
    rejectUnauthorized?: boolean;
}
export interface ClientAppOptions {
    tokenGrantOptions: TokenGrantOptions;
    clientAppSettings: ClientAppSettings;
    authorizationRedirectUrl?: string;
}
export declare class TokenGrant {
    private jQuery;
    options: TokenGrantOptions;
    clientAppSettings: ClientAppSettings;
    constructor(jQuery: any, options: TokenGrantOptions, clientAppSettings: ClientAppSettings);
    getAccessTokenFromAuthCode(code: string, done: (err: any, access: Access) => void): void;
    getAccessTokenFromPassword(username: string, password: string, done: (err: any, access: Access) => void): void;
    refreshAccessToken(refresh_token: string, done: (err: any, access: Access) => void): void;
}
