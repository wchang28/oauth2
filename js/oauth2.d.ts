import * as restApiIntf from "rest-api-interfaces";
export interface IError {
    error: string;
    error_description: string;
}
export interface ClientAppSettings {
    client_id: string;
    redirect_uri?: string;
    client_secret?: string;
}
export interface AccessToken {
    token_type?: string;
    access_token?: string;
}
export interface Access extends AccessToken, restApiIntf.ConnectOptions {
    refresh_token?: string;
    scope?: string;
    expires_in?: number;
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
    scope?: string;
    nonce?: string;
    prompt?: string;
}
export interface AuthCodeWorkflowQueryParams {
    code: string;
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
export interface ITokenGrantCompletionHandler {
    (err: any, access: Access): void;
}
export interface ITokenGrant {
    getAccessTokenFromAuthCode: (code: string, done: ITokenGrantCompletionHandler) => void;
    getAccessTokenFromPassword: (username: string, password: string, done: ITokenGrantCompletionHandler) => void;
    refreshAccessToken: (refresh_token: string, done: ITokenGrantCompletionHandler) => void;
}
export declare class Utils {
    static getAuthWorkflowRedirectUrlWithQueryString(authorizationRedirectUrl: string, query: AuthorizationWorkflowParams): string;
    static getAuthorizationHeaderFormAccessToken(accessToken: AccessToken): string;
    static getAccessTokenFromAuthorizationHeader(authHeader: string): AccessToken;
}
export interface IErrors {
    bad_response_type: IError;
    bad_grant_type: IError;
    not_authorized: IError;
    bad_client_id: IError;
    bad_client_secret: IError;
    bad_redirect_uri: IError;
    bad_credential: IError;
}
declare let errors: {
    bad_response_type: {
        error: string;
        error_description: string;
    };
    bad_grant_type: {
        error: string;
        error_description: string;
    };
    not_authorized: {
        error: string;
        error_description: string;
    };
    bad_client_id: {
        error: string;
        error_description: string;
    };
    bad_client_secret: {
        error: string;
        error_description: string;
    };
    bad_redirect_uri: {
        error: string;
        error_description: string;
    };
    bad_credential: {
        error: string;
        error_description: string;
    };
};
export { errors };
