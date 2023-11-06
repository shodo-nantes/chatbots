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
    // Reset weekResponse counts to 0
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
    // Create the weekResponse string
    const weekResponseArray = days.map((day) => {
        const vCount = weekResponse[day]['v'];
        const qCount = weekResponse[day]['?'];
        return generateWeekResponseString(day, vCount, qCount);
    });

    return weekResponseArray.join('\n');
}

// Event to handle the '/attendance' command
app.command('/attendance', async ({ ack, body, client }) => {
    await ack();

    const textAfterCommand = body.text;
    const userId = body.user_id;

    const userInfo = await client.users.info({
        user: userId,
    });

    // Extract the user's first and last name
    const userName = userInfo.user.profile.first_name;
    const userLastName = userInfo.user.profile.last_name;

    if (userAttendances[userId]) {
        // Se l'utente ha già inserito un messaggio, cancellalo
        userAttendances[userId] = [];

        // Rimuovi il primo messaggio con le emoji dall'array emojiResponse
        if (emojiResponse.length > 0) {
            emojiResponse = emojiResponse.filter((message) => !message.startsWith(`${userName} ${userLastName}`));
        }
    }

    updateUserAttendance(userId, textAfterCommand);

    // Generate the emoji
    const userResponse = generateEmojiResponse(textAfterCommand);

    emojiResponse.push(`${userName} ${userLastName} : ${userResponse}`);

    let allResponses = '';
    for (const element of emojiResponse) {
        allResponses += `${element}\n`;
    }

    // Ottieni la lista dei messaggi nel canale
    const channelHistory = await client.conversations.history({
        channel: 'C062C79CDRN',
    });

    // Loop attraverso i messaggi e cancellali uno per uno
    for (const message of channelHistory.messages) {
        if (message.ts) {
            // Verifica se il messaggio contiene l'etichetta speciale
            if (message.text && message.text.includes('[NEWWEEK]')) {
                continue; // Ignora il messaggio
            }

            await client.chat.delete({
                channel: 'C062C79CDRN',
                ts: message.ts, // Timestamp del messaggio da cancellare
            });
        }
    }

    // Send a message that includes the user's name and the emoji
    const message = `${allResponses}`;
    const weekResponseText = generateWeekResponse();
    await client.chat.postMessage({
        channel: 'C062C79CDRN',
        text: `${message}\n${weekResponseText}`,
    });
});

//NEW WEEK
app.command('/newweek', async ({ ack, client }) => {
    await ack();

    const today = new Date();
    const nextMonday = new Date(today);
    nextMonday.setDate(today.getDate() + ((1 + 7 - today.getDay()) % 7)); // Lunedì della settimana successiva
    const nextFriday = new Date(nextMonday);
    nextFriday.setDate(nextMonday.getDate() + 4); // Venerdì della settimana successiva

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
        channel: 'C062C79CDRN', // Sostituisci con il tuo canale Slack
        text: weekMessage,
    });
});
