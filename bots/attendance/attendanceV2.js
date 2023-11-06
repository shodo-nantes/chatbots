const { App } = require('@slack/bolt');
require('dotenv').config();

const app = new App({
    token: process.env.SLACK_BOT_TOKEN,
    signingSecret: process.env.SLACK_SIGNING_SECRET,
});

app.start(process.env.PORT || 3000);

const userAttendances = [];
let emojiResponse = [];
const weekResponse = [];
const days = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi'];

for (const day of days) {
    weekResponse[day] = 0;
}

function updateUserAttendance(userId, textAfterCommand) {
    if (!userAttendances[userId]) {
        userAttendances[userId] = [];
    }

    userAttendances[userId].push(textAfterCommand);
}

function generateEmojiResponse(textAfterCommand) {
    const emojiArray = [];

    for (const char of textAfterCommand) {
        if (char === 'v') {
            emojiArray.push('✅');
        } else if (char === 'x') {
            emojiArray.push('❌');
        } else {
            emojiArray.push('❓');
        }
    }
    return emojiArray.join('');
}

function generateWeekResponseString(day, vCount, qCount) {
    let response = `${day}: ${vCount}`;
    if (qCount) {
        response += ` (ou `;
        if (qCount > 1) {
            response += ' ';
        }
        response += `${vCount + qCount}`;
        response += ')';
    }
    return response;
}

function generateWeekResponse() {
    for (const day of days) {
        weekResponse[day] = { v: 0, '?': 0 };
    }

    for (const userId of Object.keys(userAttendances)) {
        const userAttendance = userAttendances[userId];
        for (const [index, day] of days.entries()) {
            for (const attendance of userAttendance) {
                switch (attendance[index]) {
                    case 'v': {
                        weekResponse[day]['v']++;
                        break;
                    }
                    case '?': {
                        weekResponse[day]['?']++;
                        break;
                    }
                }
            }
        }
    }
    const weekResponseArray = days.map((day) => {
        const vCount = weekResponse[day]['v'];
        const qCount = weekResponse[day]['?'];
        return generateWeekResponseString(day, vCount, qCount);
    });

    return weekResponseArray.join('\n');
}

app.command('/attendance', async ({ ack, body, client }) => {
    await ack();

    const textAfterCommand = body.text;
    const userId = body.user_id;

    const userInfo = await client.users.info({
        user: userId,
    });

    const userName = userInfo.user.profile.first_name;
    const userLastName = userInfo.user.profile.last_name;

    if (userAttendances[userId]) {
        userAttendances[userId] = [];

        if (emojiResponse.length > 0) {
            emojiResponse = emojiResponse.filter((message) => !message.startsWith(`${userName} ${userLastName}`));
        }
    }

    updateUserAttendance(userId, textAfterCommand);

    const userResponse = generateEmojiResponse(textAfterCommand);

    emojiResponse.push(`${userName} ${userLastName} : ${userResponse}`);

    let allResponses = '';
    for (const element of emojiResponse) {
        allResponses += `${element}\n`;
    }

    const channelHistory = await client.conversations.history({
        channel: 'C062C79CDRN',
    });

    for (const message of channelHistory.messages) {
        if (message.ts) {
            if (message.text && message.text.includes('[NEWWEEK]')) {
                continue;
            }

            await client.chat.delete({
                channel: 'C062C79CDRN',
                ts: message.ts,
            });
        }
    }

    const message = `${allResponses}`;
    const weekResponseText = generateWeekResponse();
    await client.chat.postMessage({
        channel: 'C062C79CDRN',
        text: `${message}\n${weekResponseText}`,
    });
});

app.command('/newweek', async ({ ack, client }) => {
    await ack();

    const today = new Date();
    const nextMonday = new Date(today);
    nextMonday.setDate(today.getDate() + ((1 + 7 - today.getDay()) % 7));
    const nextFriday = new Date(nextMonday);
    nextFriday.setDate(nextMonday.getDate() + 4);
    const formattedStartDate = nextMonday.toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'numeric',
        year: 'numeric',
    });

    const formattedEndDate = nextFriday.toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'numeric',
        year: 'numeric',
    });

    const weekMessage = `Semaine du ${formattedStartDate} au ${formattedEndDate} [NEWWEEK]`;

    await client.chat.postMessage({
        channel: 'C062C79CDRN',
        text: weekMessage,
    });
});
