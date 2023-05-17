const users = [
    {
        name: 'Gwenn Stacy',
        birthday: '10 Avril',
    },
    {
        name: 'Thomas Price',
        birthday: '20 Mai',
    },
    {
        name: 'Spider Man',
        birthday: '20 Mai',
    },
];
function greetsBirthday(date) {
    for (const index in users) {
        const user = users[index];
        const greeting = greetsUserBirthday(user, date);
        if (greeting) {
            return greeting;
        }
    }
    return 'Joyeux anniversaire Michel Anniversaire';
}
function greetsUserBirthday(user, date) {
    if (date.startsWith(user.birthday)) {
        return `Joyeux anniversaire ${user.name}`;
    }
}

module.exports = { greetsBirthday };
