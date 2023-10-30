require('./index');

const userAttendances = {};

const weekResponse = {}; // Changed to an object for aggregation
const days = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi'];

// Initialize weekResponse with 0 counts for each day
days.forEach((day) => {
    weekResponse[day] = 0;
});

// Function to update user attendance
function updateUserAttendance(userId, textAfterCommand) {
    if (!userAttendances[userId]) {
        userAttendances[userId] = [];
    }

    userAttendances[userId].push(textAfterCommand);
}

// Function to generate emoji response
function generateEmojiResponse(textAfterCommand) {
    const emojiArray = [];

    for (let i = 0; i < textAfterCommand.length; i++) {
        const char = textAfterCommand[i];
        if (char === 'v') {
            emojiArray.push("✅");
        } else if (char === 'x') {
            emojiArray.push("❌");
        } else {
            emojiArray.push("❓");
        }
    }

    const attendanceEmoji = emojiArray.join('');
    return attendanceEmoji;
}


// app.event('message', async ({ event }) => {

//     // If there's a current message, delete it
//     if (weekResponse) {
//         try {
//             await app.client.weekResponse.delete({
//                 channel: event.user
//             });
//         } catch (error) {
//             console.error('Error deleting previous message:', error);
//         }
//     }

// });



// Function to generate the response with the days of the week
function generateWeekResponse() {
    // Reset weekResponse counts to 0
    days.forEach((day) => {
        weekResponse[day] = 0;
    });

    Object.keys(userAttendances).forEach((userId) => {
        const userAttendance = userAttendances[userId];
        days.forEach((day, i) => {
            userAttendance.forEach((attendance) => {
                if (attendance[i] === 'v') {
                    weekResponse[day]++; // Increment the count for the day
                } else if (attendance[i] === 'x') {
                    return; // Exit the loop if there's an absence
                }
            });
        });
    });

    // Create the weekResponse string
    const weekResponseArray = days.map((day) => `${day}: ${weekResponse[day]}`);
    return weekResponseArray.join('\n');
}

// Event to handle the '/attendance' command
app.command('/attendance', async ({ ack, body, client }) => {
    await ack();

    const textAfterCommand = body.text;
    const userId = body.user_id;

    updateUserAttendance(userId, textAfterCommand);

    const channelId = 'C062C79CDRN';
    const userName = body.user_name.replace(/\.(fr|com|io)/, '');

    // Generate the emoji
    const emojiResponse = generateEmojiResponse(textAfterCommand);

    // Send a message that includes the user's name and the emoji
    const message = `@${userName} ${emojiResponse}`;
    await client.chat.postMessage({
        channel: 'C062C79CDRN',
        text: message,
    });

    // Update attendance and send the weekly report
    const weekResponseText = generateWeekResponse();
    await client.chat.postMessage({
        channel: 'C062C79CDRN',
        text: weekResponseText,
    });
});
