const jsonData = require('./users.json');
const birthdayBot = require('./birthday');

describe('birthdayBot', () => {
    test('Should wish birthday to Michel everyday', () => {
        expect(birthdayBot.greetsBirthdays()).toContain('Joyeux anniversaire Michel Anniversaire');
    });

    test('Should return happy birthday to users with the same birthday', () => {
        for (const user of jsonData.users) {
            if (user.name === 'Thomas Price' || user.name === 'Peter Parker') {
                user.birthday = Date.now();
            }
        }

        expect(birthdayBot.greetsBirthdays()).toContain(
            'Joyeux anniversaire Thomas Price',
            'Joyeux anniversaire Peter Parker',
            'Joyeux anniversaire Michel Anniversaire',
        );
    });
});
