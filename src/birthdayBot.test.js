const birthdayBot = require('./birthdayBot');

const expectedMichelBirthdayMessage = 'Joyeux anniversaire Michel Anniversaire';
const thomasPriceBirthday = 'Joyeux anniversaire Thomas Price';


describe('birthdayBot', () => {
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
            name: 'Peter Parker',
            birthday: '20 Mai',
        },
    ];
    test('Should wish birthday to Michel everyday', () => {
        expect(birthdayBot.greetsBirthdays(' ')).toStrictEqual(expectedMichelBirthdayMessage);
    });
    test('Should wish happy birthday to Thomas price on the 20th May 2023', () => {
        expect(birthdayBot.greetsUserBirthday(users[1], '20 Mai 2023')).toStrictEqual(thomasPriceBirthday);
    });
    test('Should wish happy birthday to Gwenn Stacy on the 10th April 2023', () => {
        expect(birthdayBot.greetsUserBirthday(users[0], '10 Avril 2023')).toStrictEqual(
            'Joyeux anniversaire Gwenn Stacy',
        );
    });
    test('Should wish happy birthday to Thomas price every 20th May', () => {
        expect(birthdayBot.greetsUserBirthday(users[1], '20 Mai 2060')).toStrictEqual(thomasPriceBirthday);
    });
    test('Should return happy birthday to users with the same birthday', () => {
        expect(birthdayBot.getBirthdaysToGreet('20 Mai')).toMatchObject([
            'Joyeux anniversaire Thomas Price',
            'Joyeux anniversaire Peter Parker',
        ]);

    });
});
