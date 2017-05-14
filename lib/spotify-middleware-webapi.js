'use strict';

var apiToken     = require('./token');
var apiUser      = require('./user');
var apiPlaylists = require('./playlists');
var apiFollowing = require('./following');
var apiFollowingUser     = apiFollowing.user;
var apiFollowingPlaylist = apiFollowing.playlist;

function SpotifyModule(opts) {
  opts = opts || {};
  this.credentials = opts.credentials || {};
  this.baseUrl     = opts.baseUrl || 'https://api.spotify.com';

  this.user = apiUser.get.bind(this);
  this.playlists = apiPlaylists.get.bind(this);
  this.following = {};
  this.following.user          = apiFollowingUser.get.bind(this);
  this.following.user.get      = apiFollowingUser.get.bind(this);
  this.following.user.add      = apiFollowingUser.add.bind(this);
  this.following.user.delete   = apiFollowingUser.delete.bind(this);
  this.following.user.contains = apiFollowingUser.contains.bind(this);

  this.following.playlist = {};
  this.following.playlist.add      = apiFollowingPlaylist.add.bind(this);
  this.following.playlist.delete   = apiFollowingPlaylist.delete.bind(this);
  this.following.playlist.contains = apiFollowingPlaylist.contains.bind(this);
}

SpotifyModule.prototype.tokenRefresh = apiToken.refresh;
SpotifyModule.prototype.userGet      = apiUser.get;
SpotifyModule.prototype.followingGet = apiFollowingUser.get;
SpotifyModule.prototype.followingAdd = apiFollowingUser.add;
SpotifyModule.prototype.followingDel = apiFollowingUser.delete;
SpotifyModule.prototype.followingContains = apiFollowingUser.contains;

module.exports = SpotifyModule;
