var TokenGrant = (function () {
    function TokenGrant(jQuery, options, clientAppSettings) {
        this.jQuery = jQuery;
        this.options = options;
        this.clientAppSettings = clientAppSettings;
    }
    // authorization_code workflow
    TokenGrant.prototype.getAccessTokenFromAuthCode = function (code, done) {
        var params = {
            grant_type: 'authorization_code',
            code: code,
            client_id: this.clientAppSettings.client_id,
            client_secret: this.clientAppSettings.client_secret,
            redirect_uri: this.clientAppSettings.redirect_uri
        };
        if (typeof this.options.rejectUnauthorized === 'boolean')
            this.jQuery.ajax.defaults({ rejectUnauthorized: this.options.rejectUnauthorized });
        this.jQuery.post(this.options.url, params)
            .done(function (data) {
            var access = JSON.parse(data);
            if (typeof done === 'function')
                done(null, access);
        }).fail(function (err) {
            if (typeof done === 'function')
                done(err, null);
        });
    };
    // password workflow
    TokenGrant.prototype.getAccessTokenFromPassword = function (username, password, done) {
        var params = {
            grant_type: 'password',
            client_id: this.clientAppSettings.client_id,
            client_secret: this.clientAppSettings.client_secret,
            username: username,
            password: password
        };
        if (typeof this.options.rejectUnauthorized === 'boolean')
            this.jQuery.ajax.defaults({ rejectUnauthorized: this.options.rejectUnauthorized });
        this.jQuery.post(this.options.url, params)
            .done(function (data) {
            var access = JSON.parse(data);
            if (typeof done === 'function')
                done(null, access);
        }).fail(function (err) {
            if (typeof done === 'function')
                done(err, null);
        });
    };
    ;
    TokenGrant.prototype.refreshAccessToken = function (refresh_token, done) {
        var params = {
            grant_type: 'refresh_token',
            client_id: this.clientAppSettings.client_id,
            client_secret: this.clientAppSettings.client_secret,
            refresh_token: refresh_token
        };
        if (typeof this.options.rejectUnauthorized === 'boolean')
            this.jQuery.ajax.defaults({ rejectUnauthorized: this.options.rejectUnauthorized });
        this.jQuery.post(this.options.url, params)
            .done(function (data) {
            var access = JSON.parse(data);
            if (typeof done === 'function')
                done(null, access);
        }).fail(function (err) {
            if (typeof done === 'function')
                done(err, null);
        });
    };
    ;
    return TokenGrant;
}());
exports.TokenGrant = TokenGrant;
var Utils = (function () {
    function Utils() {
    }
    Utils.getAuthWorkflowRedirectUrlWithQueryString = function (authorizationRedirectUrl, query) {
        var url = authorizationRedirectUrl + '?';
        var ar = [];
        for (var fld in query) {
            if (query[fld])
                ar.push(encodeURIComponent(fld) + '=' + encodeURIComponent(query[fld]));
        }
        url += ar.join('&');
        return url;
    };
    return Utils;
}());
exports.Utils = Utils;
var errors = {
    bad_response_type: { error: "unsupported_response_type", error_description: "response type is not supported" },
    bad_grant_type: { error: "unsupported_grant_type", error_description: "grant type not supported" },
    not_authorized: { error: 'not_authorized', error_description: 'not authorized' },
    bad_client_id: { error: "invalid_client_id", error_description: "client identifier invalid" },
    bad_client_secret: { error: "invalid_client", error_description: "invalid client credentials" },
    bad_redirect_uri: { error: "redirect_uri_mismatch", error_description: "redirect_uri must match configuration" },
    bad_credential: { error: "invalid_grant", error_description: "authentication failure" } // bad username or password
};
exports.errors = errors;
