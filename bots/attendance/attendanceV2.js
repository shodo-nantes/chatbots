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
const presenceValue = 'v';
const absenceValue = 'x';
const optionalValue = '?';

app.command('/attendance', async ({ ack, body, client }) => {
    await ack();

    const userAttendance = normalizeUserAttendance(body.text);
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

    updateUserAttendance(userId, userAttendance);

    const userResponse = generateEmojiResponse(userAttendance);

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
    function formatDate(date) {
        return date.toLocaleDateString('fr-FR', {
            day: 'numeric',
            month: 'numeric',
            year: 'numeric',
        });
    }

    const formattedStartDate = formatDate(nextMonday);
    const formattedEndDate = formatDate(nextFriday);
    // const formattedStartDate = nextMonday.toLocaleDateString('fr-FR', {
    //     day: 'numeric',
    //     month: 'numeric',
    //     year: 'numeric',
    // });

    // const formattedEndDate = nextFriday.toLocaleDateString('fr-FR', {
    //     day: 'numeric',
    //     month: 'numeric',
    //     year: 'numeric',
    // });

    const weekMessage = `Semaine du ${formattedStartDate} au ${formattedEndDate} [NEWWEEK]`;

    await client.chat.postMessage({
        channel: 'C062C79CDRN',
        text: weekMessage,
    });
});

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
        if (char === presenceValue) {
            emojiArray.push('✅');
        } else if (char === absenceValue) {
            emojiArray.push('❌');
        } else {
            emojiArray.push('❓');
        }
    }
    return emojiArray.join('');
}

function generateWeekResponseString(day, presenceCount, optionalCount) {
    let response = `${day}: ${presenceCount}`;
    if (optionalCount) {
        response += ` (ou `;
        if (optionalCount > 1) {
            response += ' ';
        }
        response += `${presenceCount + optionalCount}`;
        response += ')';
    }
    return response;
}

function generateWeekResponse() {
    for (const day of days) {
        weekResponse[day] = { presenceCount: 0, optionalCount: 0 };
    }

    for (const userId of Object.keys(userAttendances)) {
        const userAttendance = userAttendances[userId];
        for (const [index, day] of days.entries()) {
            for (const attendance of userAttendance) {
                switch (attendance[index]) {
                    case presenceValue: {
                        weekResponse[day].presenceCount++;
                        break;
                    }
                    case '?': {
                        weekResponse[day].optionalCount++;
                        break;
                    }
                }
            }
        }
    }
    const weekResponseArray = days.map((day) => {
        return generateWeekResponseString(day, weekResponse[day].presenceCount, weekResponse[day].optionalCount);
    });

    return weekResponseArray.join('\n');
}

function normalizeUserAttendance(value) {
    let result = '';
    for (const dayAttendance of value) {
        if (dayAttendance === 'v' || dayAttendance === 'V' || dayAttendance === '1') {
            result += presenceValue;
        } else if (dayAttendance === 'x' || dayAttendance === 'X' || dayAttendance === '0') {
            result += absenceValue;
        } else {
            result += optionalValue;
        }
    }
    return result;
}
