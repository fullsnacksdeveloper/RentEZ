const fs = require('fs');
const { google } = require('googleapis');

// Load your OAuth2 credentials
const credentials = JSON.parse(fs.readFileSync('google_credentials.json'));

const { client_secret, client_id, redirect_uris } = credentials.web;

const oAuth2Client = new google.auth.OAuth2(
  client_id,
  client_secret,
  redirect_uris[0] // Should be http://localhost:3000/oauth2callback
);

module.exports = oAuth2Client;
