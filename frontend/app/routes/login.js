import Ember from 'ember';

export default Ember.Route.extend({

    actions: {
        socialLogin: function(provider) {
            this.get('session').authenticate('simple-auth-authenticator:torii', provider);
            return;
        }
    }
});
