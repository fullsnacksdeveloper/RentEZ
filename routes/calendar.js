// routes/calendar.js
const express = require('express');
const router = express.Router();
const fs = require('fs');
const { google } = require('googleapis');
const oAuth2Client = require('../googleAuth');

// Redirect to Google Sign-in
router.get('/login', (req, res) => {
  const scopes = ['https://www.googleapis.com/auth/calendar.events'];
  const url = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: scopes,
  });
  res.redirect(url);
});

// OAuth2 callback
router.get('/oauth2callback', async (req, res) => {
  const code = req.query.code;
  try {
    const { tokens } = await oAuth2Client.getToken(code);
    oAuth2Client.setCredentials(tokens);
    fs.writeFileSync('token.json', JSON.stringify(tokens));
    res.send("✅ Google Calendar authentication successful! You may now close this tab.");
  } catch (err) {
    console.error("❌ Error retrieving token:", err);
    res.status(500).send("Authentication failed");
  }
});

// Create calendar event
router.post('/event', async (req, res) => {
  try {
    const tokens = JSON.parse(fs.readFileSync('token.json'));
    oAuth2Client.setCredentials(tokens);

    const calendar = google.calendar({ version: 'v3', auth: oAuth2Client });

    const {
      summary,
      description,
      location,
      startTime,
      endTime,
      attendeeEmail
    } = req.body;

    const event = {
      summary,
      location,
      description,
      start: {
        dateTime: startTime,
        timeZone: 'America/Jamaica',
      },
      end: {
        dateTime: endTime,
        timeZone: 'America/Jamaica',
      },
      attendees: [{ email: attendeeEmail }],
      reminders: {
        useDefault: false,
        overrides: [
          { method: 'email', minutes: 60 },
          { method: 'popup', minutes: 10 },
        ],
      },
    };

    const response = await calendar.events.insert({
      calendarId: 'primary',
      resource: event
    });

    res.status(200).json({
      message: 'Event created successfully',
      link: response.data.htmlLink
    });
  } catch (error) {
    console.error('Calendar error:', error);
    res.status(500).send('Failed to create calendar event');
  }
});

module.exports = router;
