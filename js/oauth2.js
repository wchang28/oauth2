var TokenGrant = (function () {
    function TokenGrant(jQuery, tokenGrantUrl, clientAppSettings) {
        this.jQuery = jQuery;
        this.tokenGrantUrl = tokenGrantUrl;
        this.clientAppSettings = clientAppSettings;
    }
    TokenGrant.prototype.getAccessTokenFromAuthCode = function (code, done) {
        var params = {
            grant_type: 'authorization_code',
            code: code,
            client_id: this.clientAppSettings.client_id,
            client_secret: this.clientAppSettings.client_secret,
            redirect_uri: this.clientAppSettings.redirect_uri
        };
        this.jQuery.post(this.tokenGrantUrl, params)
            .done(function (data) {
            var access = JSON.parse(data);
            if (typeof done === 'function')
                done(null, access);
        }).fail(function (err) {
            if (typeof done === 'function')
                done(err, null);
        });
    };
    TokenGrant.prototype.getAccessTokenFromPassword = function (username, password, done) {
        var params = {
            grant_type: 'password',
            client_id: this.clientAppSettings.client_id,
            client_secret: this.clientAppSettings.client_secret,
            username: username,
            password: password
        };
        this.jQuery.post(this.tokenGrantUrl, params)
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
        this.jQuery.post(this.tokenGrantUrl, params)
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
