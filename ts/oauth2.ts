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
    token_type: string;
    access_token: string;
}

export interface Access extends AccessToken {
    refresh_token?: string;
    instance_url?: string;
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

export class TokenGrant {
    constructor(private jQuery:any, public options:TokenGrantOptions, public clientAppSettings:ClientAppSettings) {}
    // authorization_code workflow
    getAccessTokenFromAuthCode (code:string, done:(err:any, access: Access) => void) : void {
        let params: TokenGrantParams = {
            grant_type: 'authorization_code'
            ,code: code
            ,client_id: this.clientAppSettings.client_id
            ,client_secret: this.clientAppSettings.client_secret
            ,redirect_uri: this.clientAppSettings.redirect_uri
        };
        if (typeof this.options.rejectUnauthorized === 'boolean') this.jQuery.ajax.defaults({rejectUnauthorized: this.options.rejectUnauthorized});
        this.jQuery.post(this.options.url, params)
        .done((data) => {
            let access:Access = JSON.parse(data);
            if (typeof done === 'function') done(null, access);
        }).fail((err) => {
            if (typeof done === 'function') done(err, null);
        });		
    }
    // password workflow
    getAccessTokenFromPassword(username:string, password:string, done:(err:any, access: Access) => void) : void {
        let params: TokenGrantParams = {
            grant_type: 'password'
            ,client_id: this.clientAppSettings.client_id
            ,client_secret: this.clientAppSettings.client_secret
            ,username: username
            ,password: password
        };
        if (typeof this.options.rejectUnauthorized === 'boolean') this.jQuery.ajax.defaults({rejectUnauthorized: this.options.rejectUnauthorized});
        this.jQuery.post(this.options.url, params)
        .done((data) => {
            let access: Access = JSON.parse(data);
            if (typeof done === 'function') done(null, access);
        }).fail((err) => {
            if (typeof done === 'function') done(err, null);
        });			
    };
    refreshAccessToken(refresh_token:string, done:(err:any, access: Access) => void) : void {
        let params: TokenGrantParams = {
            grant_type: 'refresh_token'
            ,client_id: this.clientAppSettings.client_id
            ,client_secret: this.clientAppSettings.client_secret
            ,refresh_token: refresh_token
        };
        if (typeof this.options.rejectUnauthorized === 'boolean') this.jQuery.ajax.defaults({rejectUnauthorized: this.options.rejectUnauthorized});
        this.jQuery.post(this.options.url, params)
        .done((data) => {
            let access:Access = JSON.parse(data);
            if (typeof done === 'function') done(null, access);
        }).fail((err) => {
            if (typeof done === 'function') done(err, null);
        });		
    };
}

export class Utils {
    public static getBrowserAuthRedirectUrlWithQueryString(authorizationRedirectUrl: string, client_id: string, redirect_uri:string, state?:string) : string {
        let url = authorizationRedirectUrl;
        url += '?';
        let query:AuthorizationWorkflowParams = {
            response_type: 'code'
            ,client_id: client_id
            ,redirect_uri: redirect_uri
        };
        if (state) query.state = state;
        let ar = [];
        for (var fld in query) {
            if (query[fld])
                ar.push(encodeURIComponent(fld) + '=' + encodeURIComponent(query[fld]));
        }
        url += ar.join('&');
        return url;
    }
}

export interface IErrors {
    bad_response_type:IError;
    bad_grant_type:IError;
    not_authorized: IError;
}

let errors = {
   bad_response_type: {error: "unsupported_response_type", error_description:"response type is not supported"}
   ,bad_grant_type: {error: "unsupported_grant_type", error_description:"grant type not supported"}
   ,not_authorized: {error: 'not_authorized', error_description: 'not authorized'}
}

export {errors};
