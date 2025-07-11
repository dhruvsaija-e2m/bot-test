# Slack Project Kickoff App

This is a Slack app built with Bolt for JavaScript. It launches a multi-step modal form for project kickoff using the `/start-project` command.

## Features
- Step 1: Select a project type
- Step 2: If 'Messaging' is selected, fill out a detailed form with custom fields

## Setup

1. **Clone the repo and install dependencies:**
   ```bash
   npm install
   ```

2. **Create a Slack App:**
   - Go to https://api.slack.com/apps and create a new app
   - Enable Socket Mode and add the following scopes:
     - `commands`
     - `chat:write`
     - `commands`
     - `users:read`
     - `users:read.email`
     - `app_mentions:read`
     - `im:history`
     - `im:write`
     - `im:read`
     - `channels:read`
     - `groups:read`
     - `mpim:read`
   - Add a Slash Command `/start-project` pointing to your app

3. **Set environment variables:**
   Create a `.env` file in the root directory with:
   ```env
   SLACK_BOT_TOKEN=xoxb-your-bot-token
   SLACK_SIGNING_SECRET=your-signing-secret
   SLACK_APP_TOKEN=xapp-your-app-level-token
   PORT=3000
   ```

4. **Run the app:**
   ```bash
   node app.js
   ```

5. **Invite the bot to your Slack workspace and use `/start-project`**

## Customization
- To add more project types or custom modals, edit `app.js`.

---
Built with [Bolt for JavaScript](https://slack.dev/bolt-js/) 