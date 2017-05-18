'use strict';

var _request = require('./request');
var apiToken = require('./token');

/**
 * Get profile (current user or user by UserId)
 * https://api.spotify.com/v1/me
 * https://api.spotify.com/v1/users/{user_id}
 * @param userId
 * @param tokens *
 * @param callback
 */
function get(userId, tokens, callback) {
  var _this = this;
  var args = arguments.length;

  if (args < 1) return 'Invalid arguments';

  if (args === 1) {
    tokens = userId;
    userId = false;
  }

  if (args === 2) {
    // (userId/tokens, tokens/callback)
    if (typeof tokens === 'function') {
      callback = tokens;
      tokens = userId;
      userId = false;
    }
  }

  callback = callback || function() {};

  // check arguments start
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

      return get.call(_this, userId, accessToken, callback);
    });
  };
  // try refresh token function finish

  if (!accessToken) {
    return refreshTry();
  }

  var uri = this.baseUrl + (userId ? '/users/' + userId : '/v1/me');

  var requestOpts = {
    method: 'GET',
    uri: uri,
  };

  return _request.call(_this, requestOpts, accessToken, refreshToken, refreshTry, callback);
}

module.exports = {
  get: get,
};

