'use strict';

var
  rp       = require('request-promise'),
  apiToken = require('./token'),
  followingUrl = '/v1/me/following',
  followingTypeDefault = 'user',
  followingTypes = [followingTypeDefault, 'artist'];

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
 * @param cb - callback(error, body, accessToken (new or current))
 */
exports.get = function (followingType, opts, tokens, cb) {
  // redefine default type, because currently only artist is supported.
  followingTypeDefault = 'artist';
  var
    _this = this,
    args = arguments.length;

  if (args === 0) return cb('Invalid arguments');

  if (args === 1) {
    // (tokens)
    tokens        = followingType;
    followingType = followingTypeDefault;
    opts          = {}
  }

  if (args === 2) {
    // (followingType/opts/tokens , tokens/cb)
    // followingType - can be string type/ object opts/ string or object tokens
    // opts - can be string or object tokens/ cb

    if (typeof opts === 'function') {
      cb            = opts;
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
    // (followingType/opts, opts/tokens, tokens/cb)
    // followingType - can be string type/ object opts
    // opts - can be object opts/ string or object tokens
    // tokens - can be string or object tokens/ cb

    // (followingType/opts, tokens, cb)
    if (typeof tokens === 'function') {
      cb     = tokens;
      tokens = opts;
      opts          = (typeof followingType === 'string') ? {} : followingType;
      followingType = (typeof followingType === 'string') ? followingType : followingTypeDefault;
    }
  }

  cb = cb || function () {};

  // check arguments start
  if (followingTypes.indexOf(followingType) === -1) return cb('Invalid followingType');
  if (typeof opts !== 'object') return cb('Invalid opts');
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
  var refreshTry = function () {
    apiToken.refresh.call(_this, refreshToken, function (err, accessToken) {
      if (err) return cb(err);

      _this.followingGet(followingType, opts, accessToken, cb);
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
};

/**
 * Follow Artists or Users
 * @param followingId *
 * @param followingType
 * @param tokens * (String accessToken or {accessToken: String, refreshToken: String})
 * @param cb - callback(error, body, accessToken (new or current))
 */

exports.add = function(followingId, followingType, tokens, cb) {
  var
    _this = this,
    args = arguments.length;

  if (args < 2) return cb('Invalid arguments');

  if (args === 2) {
    tokens = followingType;
    followingType = followingTypeDefault
  }

  if (args === 3) {
    // (followingId, followingType/tokens, tokens/cb)
    if (typeof tokens === 'function') {
      cb            = tokens;
      tokens        = followingType;
      followingType = followingTypeDefault;
    } else {
      followingType = ((typeof followingType === 'string') && (followingTypes.indexOf(followingType) !== -1)) ? followingType : followingTypeDefault;
    }
  }

  cb = cb || function () {};

  // check arguments start
  if (!followingId) return cb('Invalid followingId');
  if (followingTypes.indexOf(followingType) === -1) return cb('Invalid followingType');

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
  var refreshTry = function () {
    apiToken.refresh.call(_this, refreshToken, function (err, accessToken) {
      if (err) return cb(err);

      _this.followingAdd(followingId, followingType, accessToken, cb);
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
      //console.log('err::statusCode', response.error.error.message);
      //console.log('err::statusCode', response.statusCode);
      //console.log('err::message   ', response.message);

      if (response.statusCode === 401 && response.error.error.message === 'The access token expired' && refreshToken) {
        return refreshTry();
      }

      cb(response.error);
    });
};

/**
 * Unfollow Artists or Users
 * @param followingId *
 * @param followingType
 * @param tokens * (String accessToken or {accessToken: String, refreshToken: String})
 * @param cb - callback(error, body, accessToken (new or current))
 */
exports.delete = function (followingId, followingType, tokens, cb) {
  var
    _this = this,
    args = arguments.length;

  if (args < 2) return cb('Invalid arguments');

  if (args === 2) {
    tokens = followingType;
    followingType = followingTypeDefault
  }

  if (args === 3) {
    // (followingId, followingType/tokens, tokens/cb)
    if (typeof tokens === 'function') {
      cb            = tokens;
      tokens        = followingType;
      followingType = followingTypeDefault;
    } else {
      followingType = ((typeof followingType === 'string') && (followingTypes.indexOf(followingType) !== -1)) ? followingType : followingTypeDefault;
    }
  }

  cb = cb || function () {};

  // check arguments start
  if (!followingId) return cb('Invalid followingId');
  if (followingTypes.indexOf(followingType) === -1) return cb('Invalid followingType');

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
  var refreshTry = function () {
    apiToken.refresh.call(_this, refreshToken, function (err, accessToken) {
      if (err) return cb(err);

      _this.followingDel(followingId, followingType, accessToken, cb);
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
};

/**
 * Check if User Follows Users or Artists
 * @param followingId *
 * @param followingType
 * @param tokens * (String accessToken or {accessToken: String, refreshToken: String})
 * @param cb - callback(error, body, accessToken (new or current))
 */
exports.contains = function(followingId, followingType, tokens, cb) {
  var
    _this = this,
    args = arguments.length;

  if (args < 2) return cb('Invalid arguments');

  if (args === 2) {
    tokens = followingType;
    followingType = followingTypeDefault
  }

  if (args === 3) {
    // (followingId, followingType/tokens, tokens/cb)
    if (typeof tokens === 'function') {
      cb            = tokens;
      tokens        = followingType;
      followingType = followingTypeDefault;
    } else {
      followingType = ((typeof followingType === 'string') && (followingTypes.indexOf(followingType) !== -1)) ? followingType : followingTypeDefault;
    }
  }

  cb = cb || function () {};

  // check arguments start
  if (!followingId) return cb('Invalid followingId');
  if (followingTypes.indexOf(followingType) === -1) return cb('Invalid followingType');

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
  var refreshTry = function () {
    apiToken.refresh.call(_this, refreshToken, function (err, accessToken) {
      if (err) return cb(err);

      _this.followingContains(followingId, followingType, accessToken, cb);
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
};
