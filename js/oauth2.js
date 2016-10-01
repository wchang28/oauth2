"use strict";
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
