const { App } = require('@slack/bolt');
require('dotenv').config();
const { newWeek } = require('./newweek');
const { presences } = require('./presences');

const app = new App({
    token: process.env.SLACK_BOT_TOKEN,
    signingSecret: process.env.SLACK_SIGNING_SECRET,
});

app.start(process.env.PORT || 3000);

app.command('/presences', async ({ ack, body, client }) => {
    await ack();
    await presences(body, client);
});

app.command('/newweek', async ({ ack, client }) => {
    await ack();
    await newWeek(client);
});
