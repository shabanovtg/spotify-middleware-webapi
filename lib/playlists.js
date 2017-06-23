'use strict';
var _ = require('lodash');
var async = require('async');
var _request = require('./request');
var apiToken = require('./token');
var LIMIT_MAX = 50;

/**
 * Get a List of Current User's Playlists docs
 * Endpoint: https://api.spotify.com/v1/me/playlists
 * OAuth Scope: playlist-read-private
 * @param opts = {limit = 20, offset = 0}
 * @param callback
 */
function getByCurrentAuth(opts, callback) {}

/**
 * Get a List of a User's Playlists
 * Endpoint: https://api.spotify.com/v1/users/{user_id}/playlists
 * OAuth Scope: playlist-read-private, playlist-read-collaborative
 * @param userId *
 * @param opts = {limit = 20, offset = 0}
 * @param callback
 */
function getByUserId(userId, opts, callback) {}

/**
 * Get playlists (current user or user by UserId)
 * @param userId
 * @param opts = {limit = 20 (max = 50), offset = 0 (max = 100000)}
 * @param tokens *
 * @param callback
 */
function get(userId, opts, tokens, callback) {
  var _this = this;
  var args = arguments.length;

  if (args < 1) return 'Invalid arguments';

  // (userId)
  if (args === 1) {
    tokens = userId;
    userId = false;
    opts = {};
  }

  // (userId, opts)
  if (args === 2) {
    // (userId, tokens)
    // (opts  , tokens)
    // (tokens, callback)

    if (typeof opts === 'function') {
      callback = opts;
      tokens = userId;
      userId = false;
      opts = {};
    } else {
      tokens = opts;
      // userId (userId / opts)
      if (typeof userId === 'string') {
        opts = {};
      } else {
        opts = userId;
        userId = false;
      }
    }
  }

  // (userId, opts, tokens)
  if (args === 3) {
    // (userId, opts, tokens)
    // (userId, tokens, callback)
    // (opts, tokens, callback)

    if (typeof tokens === 'function') {
      callback = tokens;
      tokens = opts;

      if (typeof userId === 'string') {
        opts = {};
      } else {
        opts = userId;
        userId = false;
      }
    }
  }

  callback = callback || function() {};

  // check arguments start

  // opts defaults
  var query = {
    offset: 0,
  };

  try {
    var _limit = parseInt(opts.limit);
    if (!isNaN(_limit)) {
      query.limit = _limit;
    }
  } catch (e) {}

  try {
    var _offset = parseInt(opts.offset);
    query.offset = !isNaN(_offset) ? _offset : 0;
  } catch (e) {}

  var accessToken  = tokens;
  var refreshToken = false;

  if (typeof tokens !== 'string') {
    accessToken  = tokens.accessToken;
    refreshToken = tokens.refreshToken;
  }

  if (!accessToken && !refreshToken) return callback('Invalid tokens');
  // check arguments finish

  // try refresh token function start
  function refreshTry() {
    return apiToken.refresh.call(_this, refreshToken, function(err, accessToken) {
      if (err) return callback(err);

      return get.call(_this, userId, opts, accessToken, callback);
    });
  }
  // try refresh token function finish

  if (!accessToken) {
    return refreshTry(this);
  }

  var requestOpts = {
    method: 'GET',
    uri: this.baseUrl + (userId ? '/v1/users/' + userId + '/playlists' : '/v1/me/playlists'),
    headers: {
      Accept: 'application/json'
    },
    auth: {
      bearer: accessToken
    },
    qs: query,
    json: true,
  };


  return _request.call(_this, requestOpts, accessToken, refreshToken, refreshTry, function(err, response, accessToken) {
    if (err) return callback(err);

    if (
      !query.limit &&
      response.items &&
      response.total &&
      (response.items.length < response.total)
    ) {

      var range = _.range(response.items.length, response.total, LIMIT_MAX);
      var tasks = _.map(range, function(offset) {
        return function(cb) {
          get.call(_this, userId, {offset: offset, limit: LIMIT_MAX}, accessToken, cb);
        }
      });

      async.parallel(tasks, function(err, res) {
        _.each(res, function(_res) {
          response.items = response.items.concat(_res.items);
        });

        callback(err, response, accessToken);
      });
      return;
    }

    callback(err, response, accessToken);
  });
}

module.exports = {
  get: get,
};
