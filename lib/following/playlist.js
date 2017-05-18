'use strict';

var rp = require('request-promise');
var apiToken = require('../token');
var _request = require('../request');

/**
 * Follow a Playlist docs
 * Endpoint: PUT https://api.spotify.com/v1/users/{user_id}/playlists/{playlist_id}/followers
 * Scope: playlist-modify-public, playlist-modify-private
 * @param ownerId *
 * @param playlistId *
 * @param isPublic = Boolean { "public": false }
 * @param tokens *
 * @param callback
 */
function add(ownerId, playlistId, isPublic, tokens, callback) {
  var _this = this;
  var args = arguments.length;

  if (args < 3) return 'Invalid arguments';

  if (args === 3) {
    //ownerId, playlistId, tokens
    tokens = isPublic;
    isPublic = false;
  }

  // ownerId, playlistId, tokens, callback
  // ownerId, playlistId, isPublic, tokens
  if ((args === 4) && (typeof tokens === 'function')) {
    // ownerId, playlistId, tokens, callback
    callback = tokens;
    tokens = isPublic;
    isPublic = false;
  }

  callback = callback || function() {};

  // check arguments start
  if (!ownerId) return callback('Invalid ownerId');
  if (!playlistId) return callback('Invalid ownerId');

  var accessToken  = tokens;
  var refreshToken = false;

  if (typeof tokens !== 'string') {
    accessToken  = tokens.accessToken;
    refreshToken = tokens.refreshToken;
  }

  if (!accessToken && !refreshToken) return callback('Invalid tokens');
  // check arguments finish


  // try refresh token function start
  var refreshTry = function() {
    apiToken.refresh.call(_this, refreshToken, function(err, accessToken) {
      if (err) return callback(err);

      return add.call(_this, ownerId, playlistId, opts, accessToken, callback);
    });
  };
  // try refresh token function finish

  if (!accessToken) {
    return refreshTry();
  }

  var uri = this.baseUrl + '/v1/users/' + ownerId + '/playlists/' + playlistId + '/followers';

  var requestOpts = {
    method: 'PUT',
    uri: uri,
    body: {
      "public": !!isPublic
    }
  };

  return _request.call(_this, requestOpts, accessToken, refreshToken, refreshTry, callback);

}

/**
 * Unfollow a Playlist docs
 * Endpoint: DELETE https://api.spotify.com/v1/users/{user_id}/playlists/{playlist_id}/followers
 * Scope: playlist-modify-public, playlist-modify-private
 * @param ownerId *
 * @param playlistId *
 * @param tokens *
 * @param callback
 */
function remove(ownerId, playlistId, tokens, callback) {
  var _this = this;
  var args = arguments.length;

  if (args < 3) return 'Invalid arguments';

  callback = callback || function() {};

  // check arguments start
  if (!ownerId) return callback('Invalid ownerId');
  if (!playlistId) return callback('Invalid ownerId');

  var accessToken  = tokens;
  var refreshToken = false;

  if (typeof tokens !== 'string') {
    accessToken  = tokens.accessToken;
    refreshToken = tokens.refreshToken;
  }

  if (!accessToken && !refreshToken) return callback('Invalid tokens');
  // check arguments finish


  // try refresh token function start
  var refreshTry = function() {
    return apiToken.refresh.call(_this, refreshToken, function(err, accessToken) {
      if (err) return callback(err);

      return remove.call(_this, ownerId, playlistId, accessToken, callback);
    });
  };
  // try refresh token function finish

  if (!accessToken) {
    return refreshTry();
  }

  var uri = this.baseUrl + '/v1/users/' + ownerId + '/playlists/' + playlistId + '/followers';

  var requestOpts = {
    method: 'DELETE',
    uri: uri,
  };

  return _request.call(_this, requestOpts, accessToken, refreshToken, refreshTry, callback);
}

/**
 * Check if Users Follow a Playlist docs
 * Endpoint: https://api.spotify.com/v1/users/{user_id}/playlists/{playlist_id}/followers/contains
 * @param ownerId *
 * @param playlistId *
 * @param userIds *
 * @param tokens *
 * @param callback
 */
function contains(ownerId, playlistId, userIds, tokens, callback) {
  var _this = this;
  var args = arguments.length;

  if (args < 4) return 'Invalid arguments';

  callback = callback || function() {};

  // check arguments start
  if (!ownerId) return callback('Invalid ownerId');
  if (!playlistId) return callback('Invalid ownerId');
  if (!userIds) return callback('Invalid userIds');

  if (!Array.isArray(userIds)) {
    userIds = [userIds];
  }

  var accessToken  = tokens;
  var refreshToken = false;

  if (typeof tokens !== 'string') {
    accessToken  = tokens.accessToken;
    refreshToken = tokens.refreshToken;
  }

  if (!accessToken && !refreshToken) return callback('Invalid tokens');
  // check arguments finish


  // try refresh token function start
  var refreshTry = function() {
    return apiToken.refresh.call(_this, refreshToken, function(err, accessToken) {
      if (err) return callback(err);

      return contains.call(_this, ownerId, playlistId, userIds, accessToken, callback);
    });
  };
  // try refresh token function finish

  if (!accessToken) {
    return refreshTry();
  }

  var uri = this.baseUrl + '/v1/users/' + ownerId + '/playlists/' + playlistId + '/followers/contains';

  var requestOpts = {
    method: 'GET',
    uri: uri,
    qs: {
      ids: userIds.join(',')
    },
  };

  return _request.call(_this, requestOpts, accessToken, refreshToken, refreshTry, callback);
}

module.exports = {
  add: add,
  delete: remove,
  remove: remove,
  contains: contains,
};
