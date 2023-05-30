const jsonData = require('./users.json');

function greetsBirthdays() {
    const greetings = jsonData.users
        .filter((user) => getUserIfBirthday(user))
        .map((user) => `Joyeux anniversaire ${user.name}`);

    // As we have to wish Michel's birthday everyday, we add it anyway in "greetings".
    greetings.push('Joyeux anniversaire Michel Anniversaire');

    return greetings;
}

function getUserIfBirthday(user) {
    const today = Date.now();
    const userBirthday = new Date(user.birthday);
    if (today.day === userBirthday.day && today.month === userBirthday.month) {
        return user;
    }
}

module.exports = { greetsBirthdays, getUserIfBirthday };
