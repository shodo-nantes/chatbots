function bot(message) {
    if (message?.sender?.displayName) {
        return botResponse(`Hello ${message.sender.displayName}!`);
    }
    return botResponse('Hello World!');
}

function botResponse(message) {
    return { text: message };
}

const users = [
    {
        name: 'Gwenn Stacy',
        birthday: '10 Avril',
    },
    {
        name: 'Thomas Price',
        birthday: '20 Mai',
    },
];

function greetsAllBirthday(date) {
    for (const index in users) {
        const user = users[index];
        const greeting = getUserGreeting(user, date);
        if (greeting) {
            return greeting;
        }
    }
    return botResponse('Joyeux anniversaire Michel Anniversaire');
}
function getUserGreeting(user, date) {
    if (date.startsWith(user.birthday)) {
        return botResponse(`Joyeux anniversaire ${user.name}`);
    }
}

module.exports = { bot, greetsAllBirthday };
