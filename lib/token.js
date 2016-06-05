/**
 * Refresh accessToken with help refreshToken and credentials
 * @param refreshToken
 * @param callback
 */
exports.refresh = refresh;

var
  rp      = require('request-promise'),
  apiUrl  = 'https://accounts.spotify.com/api/token';

/**
 *
 * @param refreshToken * - String
 * @param cb - callback typeof Function
 */
function refresh(refreshToken, cb) {
  var credentials = this.credentials;
  if (!credentials || typeof credentials !== 'object') return cb('Invalid credentials');
  if (!refreshToken || typeof refreshToken !== 'string') return cb('Invalid refreshToken');
  cb = cb || function() {};

  var
    authHeader = 'Basic ' + new Buffer(credentials.clientId + ':' + credentials.clientSecret).toString('base64');

  var requestOpts = {
    method: 'POST',
    url: apiUrl,
    headers: {
      'Authorization': authHeader
    },
    form: {
      grant_type: 'refresh_token',
      refresh_token: refreshToken
    },
    json: true
  };

  rp(requestOpts)
    .then(function(response) {
      cb(false, response.access_token);
    })
    .catch(function(response) {
      cb({
        statusCode: response.statusCode,
        message: response.message
      });
    });
}
