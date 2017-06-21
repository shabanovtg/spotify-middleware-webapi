'use strict';

var _request = require('./request');
var apiToken = require('./token');

/**
 * getByOwnerIdAndPlaylistId
 * @param ownerId *
 * @param playlistId *
 * @param opts { market: String }
 * @param tokens *
 * @param callback
 */
function getByOwnerIdAndPlaylistId(ownerId, playlistId, opts, tokens, callback) {
  var _this = this;
  var args = arguments.length;

  if (args < 3) return 'Invalid arguments';

  // (ownerId, playlistId, opts/tokens, tokens/callback)
  if (args === 4 && (typeof tokens === 'function')) {
    callback = tokens;
    tokens = opts;
    opts = {};
  }

  callback = callback || function() {};

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

      return getByOwnerIdAndPlaylistId.call(_this, ownerId, playlistId, opts, accessToken, callback);
    });
  }
  // try refresh token function finish

  if (!accessToken) {
    return refreshTry(this);
  }

  var uri = this.baseUrl + '/v1/users/' + ownerId + '/playlists/' + playlistId;

  var requestOpts = {
    method: 'GET',
    uri: uri,
    qs: opts,
  };

  return _request.call(_this, requestOpts, accessToken, refreshToken, refreshTry, callback);
}

module.exports = {
  getByOwnerIdAndPlaylistId: getByOwnerIdAndPlaylistId,
};
