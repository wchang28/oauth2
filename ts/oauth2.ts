import * as restApiIntf from "rest-api-interfaces";

export interface IError {
    error: string;
    error_description: string;
}

export interface ClientAppSettings {
    client_id:string;
    redirect_uri?:string;   // weak verification for client
    client_secret?:string;  // strong verification for client
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

export type TokenGrantType = "password" | "refresh_token" | "authorization_code";

export interface TokenGrantParams extends ClientAppSettings {
    grant_type: TokenGrantType;
    code?: string;  // for authorization_code workflow
    refresh_token?: string; // refresh_token 
    username?: string;  // for password workflow
    password?: string;  // for password workflow
}

export type AuthResponseType = "code" | "token";    // authorization_code or authorization_token workflow

export interface AuthorizationWorkflowParams {
    response_type: AuthResponseType;
    client_id: string;
    redirect_uri: string;
    state?: string;
    scope?: string;
    nonce?: string;
    prompt?:string;
}

export interface AuthCodeWorkflowQueryParams {
    code:string;
    state?:string;
}

export interface TokenGrantOptions {
    url: string;
    rejectUnauthorized?: boolean
}

export interface ClientAppOptions {
    tokenGrantOptions: TokenGrantOptions;
    clientAppSettings: ClientAppSettings;
    authorizationRedirectUrl?: string   // authorization_code or authorization_token workflow redirect url
}

export interface ITokenGrantCompletionHandler {
    (err:any, access: Access) : void
}

export interface ITokenGrant {
    getAccessTokenFromAuthCode: (code:string, done: ITokenGrantCompletionHandler) => void;
    getAccessTokenFromPassword: (username:string, password:string, done: ITokenGrantCompletionHandler) => void;
    refreshAccessToken: (refresh_token:string, done: ITokenGrantCompletionHandler) => void;
}

export class Utils {
    public static getAuthWorkflowRedirectUrlWithQueryString(authorizationRedirectUrl: string, query: AuthorizationWorkflowParams) : string {
        let url = authorizationRedirectUrl + '?';
        let ar:string[] = [];
        for (let fld in query) {
            if (query[fld])
                ar.push(encodeURIComponent(fld) + '=' + encodeURIComponent(query[fld]));
        }
        url += ar.join('&');
        return url;
    }
    public static getAuthorizationHeaderFormAccessToken(accessToken: AccessToken) : string {
        return (accessToken && accessToken.token_type && accessToken.access_token ? accessToken.token_type + ' ' + accessToken.access_token : null);
    }
    public static getAccessTokenFromAuthorizationHeader(authHeader: string) : AccessToken {
        let accessToken:AccessToken = null;
        if (authHeader) {
            let x = authHeader.indexOf(' ');
            if (x != -1) {
                accessToken = {
                    token_type: authHeader.substr(0, x)
                    ,access_token: authHeader.substr(x+1)
                };
            }
        }
        return accessToken;
    }
}

export interface IErrors {
    bad_response_type:IError;
    bad_grant_type:IError;
    not_authorized:IError;
    bad_client_id:IError;
    bad_client_secret:IError;
    bad_redirect_uri:IError;
    bad_credential:IError;
}

let errors = {
    bad_response_type: {error: "unsupported_response_type", error_description:"response type is not supported"}
    ,bad_grant_type: {error: "unsupported_grant_type", error_description:"grant type not supported"}
    ,not_authorized: {error: 'not_authorized', error_description: 'not authorized'}
    ,bad_client_id: {error : "invalid_client_id", error_description : "client identifier invalid"}
    ,bad_client_secret: {error : "invalid_client", error_description : "invalid client credentials"}
    ,bad_redirect_uri: {error:"redirect_uri_mismatch",error_description:"redirect_uri must match configuration"}
    ,bad_credential: {error : "invalid_grant", error_description : "authentication failure"}	// bad username or password
}

export {errors};
