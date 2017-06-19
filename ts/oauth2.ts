import * as restApiIntf from "rest-api-interfaces";

export type IError = restApiIntf.IError;

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

// query parameters returned from the auth code workflow
export interface AuthCodeWorkflowQueryParams {
    code: string;
    state?: string;
}

// hash (#) parameters from the auth token workflow
export interface AuthTokenWorkflowHashParams extends Access {
    state?: string;
}

export type TokenGrantOptions = restApiIntf.ConnectOptions;

export interface ClientAppOptions {
    tokenGrantOptions: TokenGrantOptions;
    clientAppSettings: ClientAppSettings;
    authorizationRedirectUrl?: string   // authorization_code or authorization_token workflow redirect url
}

// TODO: TO BE OBSOLETE by ITokenGrantor
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
export interface ITokenGrantCompletionHandler {
    (err:any, access: Access) : void
}

export interface ITokenGrant {
    getAccessTokenFromAuthCode: (code:string, done: ITokenGrantCompletionHandler) => void;
    getAccessTokenFromPassword: (username:string, password:string, done: ITokenGrantCompletionHandler) => void;
    refreshAccessToken: (refresh_token:string, done: ITokenGrantCompletionHandler) => void;
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export interface ITokenRefresher {
    refreshAccessToken: (refresh_token:string) => Promise<Access>;  // refresh access token with refresh token
}

export interface ITokenGrantor extends ITokenRefresher {
    getAccessTokenFromAuthCode: (code:string) => Promise<Access>;   // grant access with auth code
    getAccessTokenFromPassword: (username:string, password:string) => Promise<Access>;  // grant access with username and password
}

export class Utils {
    // Build the redirect url with query string for the oauth2 authentication workflow
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
    // Build the query string (?...) for the auth 'code' workflow that will later be used to redirect browser client
    // returns "" if there is nothing to build
    public static buildAuthCodeWorkflowQueryString(code?: string, state?: string) : string {
        let ar: string[] = [];
        if (code) ar.push("code=" + encodeURIComponent(code));
        if (state) ar.push("state=" + encodeURIComponent(state));
        return (ar.length > 0 ? "?" + ar.join("&") : "");
    }
    // Build the hash string (#...) for the auth 'token' workflow that will later be used to redirect browser/destktop/mobile client
    // returns "" if there is nothing to build
    public static buildAuthTokenWorkflowHashString(access?: Access, state?: string) : string {
        let ar: string[] = [];
        if (access) {
            for (let fld in access) {
                if (access[fld] != null)
                    ar.push(encodeURIComponent(fld) + "=" + encodeURIComponent(access[fld].toString()));
            }           
        }
        if (state) ar.push("state=" + encodeURIComponent(state));
        return (ar.length > 0 ? "#" + ar.join("&") : "");
    }
    // Parse the hash string (#...) returned from the auth 'token' workflow. The hash string was built using the buildAuthTokenWorkflowHashString() call
    // returns {} if the hash is an empty string or null
    public static parseAuthTokenWorkflowHashString(hashString?: string) : AuthTokenWorkflowHashParams {
        if (!hashString)
            return {};
        else {
            if (hashString.substr(0) === '#') hashString = hashString.substr(1);
            if (!hashString) return {};
            let o:any = {};
            let parts = hashString.split('&');
            for (let i in parts) {
                let s = parts[i];
                let p = s.split('=');
                if (p.length === 2 && p[0] && p[1]) {
                    let fld = decodeURIComponent(p[0]);
                    let value = decodeURIComponent(p[1]);
                    if (fld === 'rejectUnauthorized') {
                        let b: boolean = (value === 'true' || value === "1")
                        o[fld] = b;
                    } else if (fld === "expires_in") {
                        if (!isNaN(parseInt(value))) o[fld] = parseInt(value);
                    } else
                        o[fld] = value;
                }
            }
            return o;
        }
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
