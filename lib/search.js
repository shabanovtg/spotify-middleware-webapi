'use strict';

var _request = require('./request');
var apiToken = require('./token');

/**
 * Search
 * @param _string *
 * @param opts
 * @param tokens *
 * @param callback
 * @returns {*}
 */
function search(_string, opts, tokens, callback) {
  var _this = this;
  var args = arguments.length;

  if (args < 2) return 'Invalid arguments';

  // (_string, tokens)
  if (args === 2) {
    tokens = opts;
    opts = {};
  }

  // (_string, opts, tokens)
  // (_string, tokens, callback)
  if ((args === 3) && (typeof tokens === 'function')) {
    callback = tokens;
    tokens = opts;
    opts = {};
  }

  callback = callback || function() {};

  // check arguments start

  // opts defaults
  var query = {
    q: _string,
    offset: 0,
    market: opts.market ? opts.market : 'from_token',
    type: 'artist' //'album, artist, track, playlist'
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

  if (opts.type) {
    if (typeof opts.type === 'string') {
      query.type = opts.type;
    } else {
      try {
        query.type = opts.type.join(',');
      } catch (e) {}
    }
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
  function refreshTry() {
    return apiToken.refresh.call(_this, refreshToken, function(err, accessToken) {
      if (err) return callback(err);

      return search.call(_this, _string, opts, accessToken, callback);
    });
  }
  // try refresh token function finish

  if (!accessToken) {
    return refreshTry(this);
  }

  var requestOpts = {
    method: 'GET',
    uri: this.baseUrl + '/v1/search',
    qs: query,
  };

  return _request.call(_this, requestOpts, accessToken, refreshToken, refreshTry, callback);
}

module.exports = search;
