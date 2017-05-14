'use strict';

var rp = require('request-promise');
var apiToken = require('./token');

/**
 * Get profile (current user or user by UserId)
 * https://api.spotify.com/v1/me
 * https://api.spotify.com/v1/users/{user_id}
 * @param userId
 * @param tokens *
 * @param cb
 */
function get(userId, tokens, cb) {
  var
    _this = this,
    args = arguments.length;

  if (args < 1) return 'Invalid arguments';

  if (args === 1) {
    tokens = userId;
    userId = false;
  }

  if (args === 2) {
    // (userId/tokens, tokens/cb)
    if (typeof tokens === 'function') {
      cb = tokens;
      tokens = userId;
      userId = false;
    }
  }

  cb = cb || function () {};

  // check arguments start
  var
    accessToken  = tokens,
    refreshToken = false;

  if (typeof tokens !== 'string') {
    accessToken  = tokens.accessToken;
    refreshToken = tokens.refreshToken;
  }

  if (!accessToken && !refreshToken) return cb('Invalid tokens');
  // check arguments finish

  // try refresh token function start
  var refreshTry = function() {
    apiToken.refresh.call(_this, refreshToken, function(err, accessToken) {
      if (err) return cb(err);

      _this.user(userId, accessToken, cb);
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
    headers: {
      Accept: 'application/json'
    },
    auth: {
      bearer: accessToken
    },
    json: true
  };

  rp(requestOpts)
    .then(function(response) {
      cb(null, response, accessToken);
      return false;
    })
    .catch(function(response) {
      if (response.statusCode === 401 && response.error.error.message === 'The access token expired' && refreshToken) {
        return refreshTry();
      }

      cb(response.error);
    });
}

module.exports = {
  get: get,
};

