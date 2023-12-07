async function newWeek(client) {
    const today = new Date();
    const weekDay = today.toLocaleString('en-us', { weekday: 'long' });
    let mondayDate;

    // eslint-disable-next-line unicorn/prefer-switch
    if (weekDay === 'Monday') {
        mondayDate = today;
    } else if (weekDay === 'Tuesday') {
        mondayDate = new Date();
        mondayDate.setDate(mondayDate.getDate() - 1);
    } else if (weekDay === 'Wednesday') {
        mondayDate = new Date();
        mondayDate.setDate(mondayDate.getDate() - 2);
    } else if (weekDay === 'Thursday') {
        mondayDate = new Date();
        mondayDate.setDate(mondayDate.getDate() - 3);
    } else if (weekDay === 'Friday' || weekDay === 'Saturday' || weekDay === 'Sunday') {
        mondayDate = new Date();
        mondayDate.setDate(mondayDate.getDate() + ((8 - today.getDay()) % 7));
    }

    const nextFriday = new Date(mondayDate);
    nextFriday.setDate(mondayDate.getDate() + 4);
    const formattedStartDate = formatDate(mondayDate);
    const formattedEndDate = formatDate(nextFriday);
    const weekMessage = `Semaine du ${formattedStartDate} au ${formattedEndDate} [NEWWEEK]`;

    await client.chat.postMessage({
        channel: process.env.SLACK_CHANNEL,
        text: weekMessage,
    });
    return weekMessage;
}

function formatDate(date) {
    return date.toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'numeric',
        year: 'numeric',
    });
}

module.exports = { newWeek };
