const { DateTime } = require('luxon');
const jsonData = require('./users.json');
const birthdayBot = require('./birthdayBot');

describe('birthdayBot', () => {
    test('Should wish birthday to Michel everyday', () => {
        expect(birthdayBot.greetsBirthdays()).toContain('Joyeux anniversaire Michel Anniversaire');
    });

    test('Should return happy birthday to users with the same birthday', () => {
        jsonData.users.map((user) => {
            if (user.name === 'Thomas Price' || user.name === 'Peter Parker') {
                user.birthday = DateTime.now().toFormat('dd/MM/yyyy');
            }
            return user;
        });

        expect(birthdayBot.greetsBirthdays()).toContain(
            'Joyeux anniversaire Thomas Price',
            'Joyeux anniversaire Peter Parker',
            'Joyeux anniversaire Michel Anniversaire',
        );
    });

    test("Should not return user if it's not their birthday", () => {
        jsonData.users.map((user) => {
            const today = DateTime.now();
            const todayMinusOneDay = today.minus(86_400_000);
            if (user.name === 'Gwenn Stacy') {
                user.birthday = todayMinusOneDay.toFormat('dd/MM/yyyy');
            }
            return user;
        });
        expect(birthdayBot.greetsBirthdays()).not.toContain('Joyeux anniversaire Gwenn Stacy');
    });
});
