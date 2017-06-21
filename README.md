# spotify-middleware-webapi

Spotify WebApi for Node.js

- refresh accessToken with help refreshToken
- get user profile
- get user playlists
- following users/artists
  + get
  + add (follow)
  + delete (unfollow)
  + contains
- following  playlist
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
spotifyModule.user({
  accessToken: accessToken,
  refreshToken: refreshToken
}, function(err, profile, accessToken) {
  // updated accessToken
});
```

or

```javascript
spotifyModule.user({
  accessToken: accessToken
}, function(err, profile, accessToken) {
  // updated accessToken
});
```

#### variant 2 - accessToken string (without refreshToken) 

```javascript
spotifyModule.user(accessToken, function(err, profile, accessToken) {
  // updated accessToken
});
```

### Search

```javascript
var q = 'search_string';
var opts = {
  limit: 20,
  offset: 0,
  market: 'US',
  type: ['album', 'artist', 'track', 'playlist']
};

spotifyModule.search(q, opts, {
  accessToken: accessToken,
  refreshToken: refreshToken
}, function(err, results, accessToken) {
  //...
});
```

### Get User profile

```javascript
spotifyModule.user({
  accessToken: accessToken,
  refreshToken: refreshToken
}, function(err, profile, accessToken) {
  //...
});
```

### Get User's Playlists


#### For current user

```javascript
spotifyModule.playlists({
  accessToken: accessToken,
  refreshToken: refreshToken
}, function(err, results, accessToken) {
  //...
});
```

#### For other user

```javascript
spotifyModule.playlists(userId, {
  accessToken: accessToken,
  refreshToken: refreshToken
}, function(err, results, accessToken) {
  //...
});
```

### Get Playlist


#### By ownerId and playlistId

```javascript
spotifyModule.playlist(ownerId, userId, opts, {
  accessToken: accessToken,
  refreshToken: refreshToken
}, function(err, results, accessToken) {
  //...
});
```


### Following 

#### Following user get

```javascript
spotifyModule.following.user({
  accessToken: accessToken,
  refreshToken: refreshToken
}, function(err, results, accessToken) {
  //...
});
```

#### Following user add

```javascript
spotifyModule.following.user.add(followingId, {
  accessToken: accessToken,
  refreshToken: refreshToken
}, function(err, results, accessToken) {
  //...
});
```

#### Following user delete

```javascript
spotifyModule.following.user.delete(followingId, {
  accessToken: accessToken,
  refreshToken: refreshToken
}, function(err, results, accessToken) {
  //...
});
```

#### Following user contains

```javascript
spotifyModule.following.user.contains(followingId, {
  accessToken: accessToken,
  refreshToken: refreshToken
}, function(err, results, accessToken) {
  //...
});
```


#### Following playlist add

```javascript
spotifyModule.following.playlist.add(playlistOwnerId, playlistId, {
  accessToken: accessToken,
  refreshToken: refreshToken
}, function(err, results, accessToken) {
  //...
});
```

#### Following playlist delete

```javascript
spotifyModule.following.playlist.delete(playlistOwnerId, playlistId, {
  accessToken: accessToken,
  refreshToken: refreshToken
}, function(err, results, accessToken) {
  //...
});
```

#### Following playlist contains

```javascript
spotifyModule.following.playlist.contains(playlistOwnerId, playlistId, userId, {
  accessToken: accessToken,
  refreshToken: refreshToken
}, function(err, results, accessToken) {
  //...
});
```
