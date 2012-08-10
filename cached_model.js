define([
  'underscore',
  'backbone',
  'simple_cache'
], function(_, Backbone, Cache) {

  return {

    initialize: function(){
      // Note: cid is uniq for all models
      this.cache = new Cache(this.cache_key || this.cid);
    },

    _handle: function(resp, status, xhr) {
      if (status === 'success') this.cache.set(resp);
    },

    save: function(key, value, options) {
      Backbone.Model.prototype.save.apply(this, [key, value, options]).then(_.bind(this._handle, this));
    },

    // this fetch method get the model from localStorage or fetching from the server
    // also provide a "cache_hit" event to listen when the model is populated with data from cache
    fetch: function(options) {
      var cacheHit = this.cache.get();
      
      if (cacheHit) {
        this.set(cacheHit);
        this.trigger('cache_hit');
      }
      else {
        Backbone.Model.prototype.fetch.apply(this, [options]).then(_.bind(this._handle, this));
      }     
    }

  }

});

