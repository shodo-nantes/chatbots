const { App } = require('@slack/bolt');
require('dotenv').config();

const handleAppHomeOpened = require('./helloWorld');

const app = new App({
    token: process.env.SLACK_BOT_TOKEN,
    signingSecret: process.env.SLACK_SIGNING_SECRET,
});

app.start(process.env.PORT || 3000);
const currentMessage = null;

// Event to handle 'app_home_opened' using the imported function
app.event('app_home_opened', async ({ event, say }) => {
    handleAppHomeOpened({ event, say, app, currentMessage });
});
const userAttendances = [];
const emojiResponse = [];
const weekResponse = [];
const days = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi'];

// Initialize weekResponse with 0 counts for each day
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

function generateWeekResponse() {
    // Reset weekResponse counts to 0
    for (const day of days) {
        weekResponse[day] = { 'v': 0, '?': 0 };
    }

    Object.keys(userAttendances).forEach((userId) => {
        const userAttendance = userAttendances[userId];
        days.forEach((day, index) => {
            userAttendance.forEach((attendance) => {
                switch (attendance[index]) {
                    case 'v':
                        weekResponse[day]['v']++; // Increment the "v" count for the day
                        break;
                    case '?':
                        weekResponse[day]['?']++; // Increment the "?" count for the day
                        break;
                    case 'x':
                        return; // Exit the loop if there's an absence
                }
            });
        });
    });

    // Create the weekResponse string
    const weekResponseArray = days.map((day) => {
        const vCount = weekResponse[day]['v'];
        const qCount = weekResponse[day]['?'];
        return `${day}: ${vCount}${qCount ? ` (ou ${qCount > 1 ? ' ' : ''}${vCount + qCount})` : ''}`;
    });

    return weekResponseArray.join('\n');
}

// Function to delete messages for the current week
async function deleteMessagesForCurrentWeek(client) {
    // Calcola la data di inizio della settimana precedente (venerdì)
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - (startDate.getDay() + 2) % 7 - 7); // Venerdì della settimana precedente

    // Calcola la data di fine della settimana precedente (giovedì)
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 7); // Giovedì della settimana precedente

    // Mantieni traccia dell'ultimo messaggio della settimana precedente
    let lastWeekLastMessage = null;

    // Ottieni la lista dei messaggi nel canale
    const channelHistory = await client.conversations.history({
        channel: 'C062C79CDRN',
    });

    // Loop attraverso i messaggi e trova l'ultimo messaggio della settimana precedente
    for (const message of channelHistory.messages) {
        if (message.ts) {
            const messageDate = new Date(parseFloat(message.ts) * 1000);
            if (messageDate >= startDate && messageDate <= endDate) {
                lastWeekLastMessage = message; // Mantieni l'ultimo messaggio della settimana precedente
            }
        }
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

    // Verifica se l'utente ha già inserito un messaggio
    if (userAttendances[userId]) {
        // Se l'utente ha già inserito un messaggio, cancellalo
        userAttendances[userId] = [];

        // Rimuovi il primo messaggio con le emoji dall'array emojiResponse
        if (emojiResponse.length > 0) {
            emojiResponse.shift();
        }
    }

    updateUserAttendance(userId, textAfterCommand);

    // Generate the emoji
    const userResponse = generateEmojiResponse(textAfterCommand);

    emojiResponse.push(`${userName} ${userLastName} : ${userResponse}`);

    let allResponses = '';
    emojiResponse.forEach((element) => {
        allResponses += `${element}\n`;
    });

    // Ottieni la lista dei messaggi nel canale
    const channelHistory = await client.conversations.history({
        channel: 'C062C79CDRN',
    });

    // Loop attraverso i messaggi e cancellali uno per uno
    for (const message of channelHistory.messages) {
        try {
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
        } catch (error) {
            if (error.message === 'An API error occurred: message_not_found') {
                // Il messaggio non esiste, puoi gestirlo come desideri
            } else {
                console.error('Error deleting message:', error);
            }
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
