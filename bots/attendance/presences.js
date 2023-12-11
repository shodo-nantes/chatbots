const userAttendances = [];
let emojiResponse = [];
const weekResponse = [];
const days = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi'];
const presenceValue = 'v';
const absenceValue = 'x';
const optionalValue = '?';

async function presences(body, client) {
    //sicurezza 5 caratteri
    if (bodyTextIsInvalid(body)) return;

    const userAttendance = normalizeUserAttendance(body.text);
    const { userId, userName, userLastName } = await extractUserInfo(body, client);

    updateUserAttendance(userId, userAttendance, userName, userLastName);

    const userResponse = generateEmojiResponse(userAttendance);

    emojiResponse.push(`${userName} ${userLastName} : ${userResponse}`);

    let allResponses = '';
    for (const element of emojiResponse) {
        allResponses += `${element}\n`;
    }

    await deleteLastAttendanceMessage(client);

    await createUpdatedAttendanceMessage(allResponses, client);
}

function bodyTextIsInvalid(body) {
    return body.text.length !== 5;
}

async function createUpdatedAttendanceMessage(allResponses, client) {
    const message = `${allResponses}`;
    const weekResponseText = generateWeekResponse();
    await client.chat.postMessage({
        slackChannel: process.env.SLACK_CHANNEL,
        text: `${message}\n${weekResponseText}`,
    });
}

async function deleteLastAttendanceMessage(client) {
    const channelHistory = await client.conversations.history({
        slackChannel: process.env.SLACK_CHANNEL,
    });

    for (const message of channelHistory.messages) {
        if (message.ts) {
            if (message.text && message.text.includes('[NEWWEEK]')) {
                continue;
            }

            await client.chat.delete({
                slackChannel: process.env.SLACK_CHANNEL,
                ts: message.ts,
            });
        }
    }
}

async function extractUserInfo(body, client) {
    const userId = body.user_id;

    const userInfo = await client.users.info({
        user: userId,
    });

    const userName = userInfo.user.profile.first_name;
    const userLastName = userInfo.user.profile.last_name;
    return { userId, userName, userLastName };
}

function updateUserAttendance(userId, textAfterCommand, userName, userLastName) {
    if (userAttendances[userId]) {
        userAttendances[userId] = [];

        if (emojiResponse.length > 0) {
            emojiResponse = emojiResponse.filter((message) => !message.startsWith(`${userName} ${userLastName}`));
        }
    }

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
        } else if (dayAttendance === '?') {
            result += optionalValue;
        } else {
            result += absenceValue;
        }
    }
    return result;
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
module.exports = {
    presences,
    generateWeekResponse,
    generateWeekResponseString,
    normalizeUserAttendance,
    generateEmojiResponse,
    updateUserAttendance,
    bodyTextIsInvalid,
};
