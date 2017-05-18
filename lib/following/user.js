'use strict';

var apiToken = require('../token');
var _request = require('../request');
var followingUrl = '/v1/me/following';
var followingTypeDefault = 'user';
var followingTypes = [followingTypeDefault, 'artist'];

/**
 * Get Followed Artists
 *
 * @param followingType - The ID type: currently only artist is supported.
 *                        08/03/2011 - https://developer.spotify.com/web-api/get-followed-artists/
 * @param opts -
 *  {
 *    limit: 'Optional. The maximum number of items to return. Default: 20. Minimum: 1. Maximum: 50.',
 *    after: 'Optional. The last artist ID retrieved from the previous request.'
 *  }
 * @param tokens * (String accessToken or {accessToken: String, refreshToken: String})
 * @param callback - callback(error, body, accessToken (new or current))
 */
function get(followingType, opts, tokens, callback) {
  // redefine default type, because currently only artist is supported.
  followingTypeDefault = 'artist';
  var _this = this;
  var args = arguments.length;

  if (args === 0) return 'Invalid arguments';

  if (args === 1) {
    // (tokens)
    tokens        = followingType;
    followingType = followingTypeDefault;
    opts          = {}
  }

  if (args === 2) {
    // (followingType/opts/tokens , tokens/callback)
    // followingType - can be string type/ object opts/ string or object tokens
    // opts - can be string or object tokens/ callback

    if (typeof opts === 'function') {
      callback            = opts;
      tokens        = followingType;
      followingType = followingTypeDefault;
      opts          = {}
    } else {
      tokens = opts;

      if (typeof followingType === 'string') {
        opts = {}
      } else {
        opts = followingType;
        followingType = followingTypeDefault;
      }
    }
  }

  if (args === 3) {
    // (followingType/opts, opts/tokens, tokens/callback)
    // followingType - can be string type/ object opts
    // opts - can be object opts/ string or object tokens
    // tokens - can be string or object tokens/ callback

    // (followingType/opts, tokens, callback)
    if (typeof tokens === 'function') {
      callback     = tokens;
      tokens = opts;
      opts          = (typeof followingType === 'string') ? {} : followingType;
      followingType = (typeof followingType === 'string') ? followingType : followingTypeDefault;
    }
  }

  callback = callback || function() {};

  // check arguments start
  if (followingTypes.indexOf(followingType) === -1) return callback('Invalid followingType');
  if (typeof opts !== 'object') return callback('Invalid opts');
  var
    accessToken  = tokens,
    refreshToken = false;

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

      get.call(_this, followingType, opts, accessToken, callback);
    });
  };
  // try refresh token function finish

  if (!accessToken) {
    return refreshTry();
  }

  var uri = this.baseUrl + followingUrl;

  opts.type = followingType;

  var requestOpts = {
    method: 'GET',
    uri: uri,
    qs: opts,
  };

  return _request.call(_this, requestOpts, accessToken, refreshToken, refreshTry, callback);
}

/**
 * Follow Artists or Users
 * @param followingId *
 * @param followingType
 * @param tokens * (String accessToken or {accessToken: String, refreshToken: String})
 * @param callback - callback(error, body, accessToken (new or current))
 */
function add(followingId, followingType, tokens, callback) {
  var _this = this;
  var args = arguments.length;

  if (args < 2) return 'Invalid arguments';

  if (args === 2) {
    tokens = followingType;
    followingType = followingTypeDefault
  }

  if (args === 3) {
    // (followingId, followingType/tokens, tokens/callback)
    if (typeof tokens === 'function') {
      callback            = tokens;
      tokens        = followingType;
      followingType = followingTypeDefault;
    } else {
      followingType = ((typeof followingType === 'string') && (followingTypes.indexOf(followingType) !== -1)) ? followingType : followingTypeDefault;
    }
  }

  callback = callback || function() {};

  // check arguments start
  if (!followingId) return callback('Invalid followingId');
  if (followingTypes.indexOf(followingType) === -1) return callback('Invalid followingType');

  var
    accessToken  = tokens,
    refreshToken = false;

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

      return add.call(_this, followingId, followingType, accessToken, callback);
    });
  };
  // try refresh token function finish

  if (!accessToken) {
    return refreshTry();
  }

  var uri = this.baseUrl + followingUrl;

  var requestOpts = {
    method: 'PUT',
    uri: uri,
    qs: {
      type: followingType,
      ids:  followingId
    },
  };

  return _request.call(_this, requestOpts, accessToken, refreshToken, refreshTry, callback);
}

/**
 * Unfollow Artists or Users
 * @param followingId *
 * @param followingType
 * @param tokens * (String accessToken or {accessToken: String, refreshToken: String})
 * @param callback - callback(error, body, accessToken (new or current))
 */
function remove(followingId, followingType, tokens, callback) {
  var _this = this;
  var args = arguments.length;

  if (args < 2) return 'Invalid arguments';

  if (args === 2) {
    tokens = followingType;
    followingType = followingTypeDefault
  }

  if (args === 3) {
    // (followingId, followingType/tokens, tokens/callback)
    if (typeof tokens === 'function') {
      callback            = tokens;
      tokens        = followingType;
      followingType = followingTypeDefault;
    } else {
      followingType = ((typeof followingType === 'string') && (followingTypes.indexOf(followingType) !== -1)) ? followingType : followingTypeDefault;
    }
  }

  callback = callback || function() {};

  // check arguments start
  if (!followingId) return callback('Invalid followingId');
  if (followingTypes.indexOf(followingType) === -1) return callback('Invalid followingType');

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

      return remove.call(_this, followingId, followingType, accessToken, callback);
    });
  };
  // try refresh token function finish

  if (!accessToken) {
    return refreshTry();
  }

  var uri = this.baseUrl + followingUrl;

  var requestOpts = {
    method: 'DELETE',
    uri: uri,
    qs: {
      type: followingType,
      ids:  followingId
    },
  };

  return _request.call(_this, requestOpts, accessToken, refreshToken, refreshTry, callback);
}

/**
 * Check if User Follows Users or Artists
 * @param followingId *
 * @param followingType
 * @param tokens * (String accessToken or {accessToken: String, refreshToken: String})
 * @param callback - callback(error, body, accessToken (new or current))
 */
function contains(followingId, followingType, tokens, callback) {
  var
    _this = this,
    args = arguments.length;

  if (args < 2) return 'Invalid arguments';

  if (args === 2) {
    tokens = followingType;
    followingType = followingTypeDefault
  }

  if (args === 3) {
    // (followingId, followingType/tokens, tokens/callback)
    if (typeof tokens === 'function') {
      callback            = tokens;
      tokens        = followingType;
      followingType = followingTypeDefault;
    } else {
      followingType = ((typeof followingType === 'string') && (followingTypes.indexOf(followingType) !== -1)) ? followingType : followingTypeDefault;
    }
  }

  callback = callback || function() {};

  // check arguments start
  if (!followingId) return callback('Invalid followingId');
  if (followingTypes.indexOf(followingType) === -1) return callback('Invalid followingType');

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

      return contains.call(_this, followingId, followingType, accessToken, callback);
    });
  };
  // try refresh token function finish

  if (!accessToken) {
    return refreshTry();
  }

  var uri = this.baseUrl + followingUrl + '/contains';

  var requestOpts = {
    method: 'GET',
    uri: uri,
    qs: {
      type: followingType,
      ids:  followingId
    },
  };

  return _request.call(_this, requestOpts, accessToken, refreshToken, refreshTry, callback);
}

module.exports = {
  get: get,
  add: add,
  delete: remove,
  remove: remove,
  contains: contains,
};
