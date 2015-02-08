import Ember from 'ember';
import {configurable} from 'torii/configuration';
import GoogleOauth2 from 'torii/providers/google-oauth2';

var GoogleOauth2Sails = GoogleOauth2.extend({
    name: 'google-oauth2-sails',
    baseUrl: 'https://accounts.google.com/o/oauth2/auth',

    // additional params that this provider requires
    requiredUrlParams: ['state'],
    optionalUrlParams: ['scope', 'request_visible_actions', 'access_type'],

    requestVisibleActions: configurable('requestVisibleActions', ''),

    accessType: configurable('accessType', ''),

    responseParams: ['code'],

    scope: configurable('scope', 'email'),

    state: configurable('state', 'STATE'),

    redirectUri: configurable('redirectUri',
        'http://localhost:8000/oauth2callback'),

    open: function () {
        var name = this.get('name'),
            url = this.buildUrl(),
            redirectUri = this.get('redirectUri'),
            responseParams = this.get('responseParams');

        return this.get('popup').open(url, responseParams).then(function (authData) {

            Ember.Logger.debug(authData);

            var missingResponseParams = [];

            responseParams.forEach(function (param) {
                if (authData[param] === undefined) {
                    missingResponseParams.push(param);
                }
            });

            if (missingResponseParams.length) {
                throw "The response from the provider is missing " +
                    "these required response params: " + responseParams.join(', ');
            }

            var authorizationCode = authData.code;
            return new Ember.RSVP.Promise(function (resolve, reject) {
                Ember.$.ajax({
                    url: 'http://localhost:1338/auths/google_oauth2?code=' + authorizationCode,
                    dataType: 'json',
                    success: Ember.run.bind(null, resolve),
                    error: Ember.run.bind(null, reject)
                });
            }).then(function (user) {

                    Ember.Logger.debug("user? -> ",user);


                    // The returned object is merged onto the session (basically). Here
                    // you may also want to persist the new session with cookies or via
                    // localStorage.
                    return {
                        currentUser: user
                    };
                });

        });
    }
});

export default GoogleOauth2Sails;
