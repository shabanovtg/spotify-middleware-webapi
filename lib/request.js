var rp = require('request-promise');

function _request(opts, accessToken, refreshToken, refresh, callback) {
  var _this = this;
  opts.json = true;
  opts.auth = {
    bearer: accessToken
  };

  opts.headers = {
    Accept: 'application/json'
  };

  rp(opts)
    .then(function (response) {
      callback(null, response, accessToken);
      return response;
    })
    .catch(function (response) {
      if (
        response.statusCode === 401
        && response.error
        && response.error.error
        // && (
        //   response.error.error.message === 'The access token expired'
        //   || response.error.error.message === 'Invalid access token'
        // )
        && refreshToken
      ) {
        return refresh.call(_this);
      }

      callback(response && response.error);
      return response;
    });
}

module.exports = _request;
