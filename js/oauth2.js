"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Utils = (function () {
    function Utils() {
    }
    // Build the redirect url with query string for the oauth2 authentication workflow
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
    // Build the query string (?...) for the auth 'code' workflow that will later be used to redirect browser client
    // returns "" if there is nothing to build
    Utils.buildAuthCodeWorkflowQueryString = function (code, state) {
        var ar = [];
        if (code)
            ar.push("code=" + encodeURIComponent(code));
        if (state)
            ar.push("state=" + encodeURIComponent(state));
        return (ar.length > 0 ? "?" + ar.join("&") : "");
    };
    // Build the hash string (#...) for the auth 'token' workflow that will later be used to redirect browser/destktop/mobile client
    // returns "" if there is nothing to build
    Utils.buildAuthTokenWorkflowHashString = function (access, state) {
        var ar = [];
        if (access) {
            for (var fld in access) {
                if (access[fld] != null)
                    ar.push(encodeURIComponent(fld) + "=" + encodeURIComponent(access[fld].toString()));
            }
        }
        if (state)
            ar.push("state=" + encodeURIComponent(state));
        return (ar.length > 0 ? "#" + ar.join("&") : "");
    };
    // Parse the hash string (#...) returned from the auth 'token' workflow. The hash string was built using the buildAuthTokenWorkflowHashString() call
    // returns {} if the hash is an empty string or null
    Utils.parseAuthTokenWorkflowHashString = function (hashString) {
        if (!hashString)
            return {};
        else {
            if (hashString.substr(0) === '#')
                hashString = hashString.substr(1);
            if (!hashString)
                return {};
            var o = {};
            var parts = hashString.split('&');
            for (var i in parts) {
                var s = parts[i];
                var p = s.split('=');
                if (p.length === 2 && p[0] && p[1]) {
                    var fld = decodeURIComponent(p[0]);
                    var value = decodeURIComponent(p[1]);
                    if (fld === 'rejectUnauthorized') {
                        var b = (value === 'true' || value === "1");
                        o[fld] = b;
                    }
                    else if (fld === "expires_in") {
                        if (!isNaN(parseInt(value)))
                            o[fld] = parseInt(value);
                    }
                    else
                        o[fld] = value;
                }
            }
            return o;
        }
    };
    Utils.getAuthorizationHeaderFormAccessToken = function (accessToken) {
        return (accessToken && accessToken.token_type && accessToken.access_token ? accessToken.token_type + ' ' + accessToken.access_token : null);
    };
    Utils.getAccessTokenFromAuthorizationHeader = function (authHeader) {
        var accessToken = null;
        if (authHeader) {
            var x = authHeader.indexOf(' ');
            if (x != -1) {
                accessToken = {
                    token_type: authHeader.substr(0, x),
                    access_token: authHeader.substr(x + 1)
                };
            }
        }
        return accessToken;
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
