 import SpotifyWebApi from "spotify-web-api-node";


 const scopes = [
        "user-read-email",
        "user-read-private",
        "playlist-read-private",
        "playlist-read-collaborative",
        "streaming",
        "user-read-private",
        "user-library-read",
        "user-top-read",
        "user-read-recently-played", 
        "user-modify-playback-state",
        "user-read-currently-playing",
        "user-read-playback-state",
        "user-read-recently-played",
        "user-follow-read",
        
 ].join(',');

 const params = {
     scope: scopes,
 }

 const queryParamsString = new URLSearchParams(params);
 
const LOGIN_URL = `https://accounts.spotify.com/authorize?${queryParamsString.toString()}`;

const spotifyApi = new SpotifyWebApi({
    clientId: process.env.NEXT_PUBLIC_CLIENT_ID,
    clientSecret: process.env.NEXT_PUBLIC_CLIENT_SECRET,
})

console.log(spotifyApi.getAccessToken()) 

export default spotifyApi; 

export {LOGIN_URL};