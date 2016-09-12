# spotify-middleware-webapi

Spotify WebApi for Node.js

- refresh accessToken with help refreshToken
- get user profile
- following 
  + get
  + add (follow)
  + delete (unfollow)
  + contains
  
## Usage

```javascript
var SpotifyModule = require('spotify-middleware-webapi');
var spotifyModule = new SpotifyModule({
  "credentials": {
    "clientId": "[clientId]",
    "clientSecret": "[clientSecret]",
    "redirect_uri": "http://localhost:3000/auth/callback"
  }
});
```

### Refresh Token

You can use [passport-spotify](https://github.com/JMPerez/passport-spotify) for auth and receive accessToken and refreshToken.

```javascript
var refreshToken = [your refresh token];

spotifyModule.tokenRefresh(refreshToken, function(err, accessToken) {
  //...
});
```

### Params

accessToken is required.
refreshToken - optional. Only for update accessToken.

#### variant 1 - object

```javascript
spotifyModule.userGet({
  accessToken: accessToken,
  refreshToken: refreshToken
}, function(err, profile, accessToken) {
  // updated accessToken
});
```

or

```javascript
spotifyModule.userGet({
  accessToken: accessToken
}, function(err, profile, accessToken) {
  // updated accessToken
});
```

#### variant 2 - accessToken string (without refreshToken) 

```javascript
spotifyModule.userGet(accessToken, function(err, profile, accessToken) {
  // updated accessToken
});
```

### Get User profile

```javascript
spotifyModule.userGet({
  accessToken: accessToken,
  refreshToken: refreshToken
}, function(err, profile, accessToken) {
  //...
});
```

### Following 

#### Following get

```javascript
spotifyModule.followingGet({
  accessToken: accessToken,
  refreshToken: refreshToken
}, function(err, results, accessToken) {
  //...
});
```

#### Following add

```javascript
spotifyModule.followingAdd(followingId, {
  accessToken: accessToken,
  refreshToken: refreshToken
}, function(err, results, accessToken) {
  //...
});
```

#### Following delete

```javascript
spotifyModule.followingDel(followingId, {
  accessToken: accessToken,
  refreshToken: refreshToken
}, function(err, results, accessToken) {
  //...
});
```

#### Following contains

```javascript
spotifyModule.followingContains(followingId, {
  accessToken: accessToken,
  refreshToken: refreshToken
}, function(err, results, accessToken) {
  //...
});
```
