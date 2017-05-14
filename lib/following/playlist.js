'use strict';

var rp = require('request-promise');
var apiToken = require('../token');

/**
 * Follow a Playlist docs
 * Endpoint: PUT https://api.spotify.com/v1/users/{user_id}/playlists/{playlist_id}/followers
 * Scope: playlist-modify-public, playlist-modify-private
 * @param ownerId *
 * @param playlistId *
 * @param opts = { "public": false }
 * @param tokens *
 * @param callback
 */
function add(ownerId, playlistId, opts, tokens, callback) {}

/**
 * Unfollow a Playlist docs
 * Endpoint: DELETE https://api.spotify.com/v1/users/{user_id}/playlists/{playlist_id}/followers
 * Scope: playlist-modify-public, playlist-modify-private
 * @param ownerId *
 * @param playlistId *
 * @param tokens *
 * @param callback
 */
function remove(ownerId, playlistId, tokens, callback) {}

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

}

module.exports = {
  add: add,
  delete: remove,
  remove: remove,
  contains: contains,
};
