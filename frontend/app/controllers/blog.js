import Ember from 'ember';

export default Ember.Controller.extend({

    title:null,
    text: null,

    _clearBlogAttributes: function(){
        this.set('text', null);
        this.set('title', null);
    },


    actions: {

        addPost: function(){
            var self = this;
            var title = this.get('title');
            var text = this.get('text');

            var model = this.store.createRecord('blog', {
                title: title,
                text: text
            });

            model.save().then(function(){
                self._clearBlogAttributes();
            }, function(e){
                Ember.Logger.debug(e);
                model.deleteRecord();
                self._clearBlogAttributes();
            });
        },
        deletePost: function(model){
            model.deleteRecord();
            model.save().then(function(){
                Ember.Logger.debug("Post deleted.");
            }, function(e){
                Ember.Logger.debug(e);
            });
        }
    }

});
