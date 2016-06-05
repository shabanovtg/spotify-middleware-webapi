'use strict';

var
  apiToken     = require('./token'),
  apiUser      = require('./user'),
  apiFollowing = require('./following');

function SpotifyModule(opts) {
  opts = opts || {};
  this.credentials = opts.credentials || {};
  this.baseUrl     = opts.baseUrl || 'https://api.spotify.com';
}

SpotifyModule.prototype.tokenRefresh = apiToken.refresh;
SpotifyModule.prototype.userGet      = apiUser.get;
SpotifyModule.prototype.followingGet = apiFollowing.get;
SpotifyModule.prototype.followingAdd = apiFollowing.add;
SpotifyModule.prototype.followingDel = apiFollowing.delete;
SpotifyModule.prototype.followingContains = apiFollowing.contains;

module.exports = SpotifyModule;
