const birthdayBot = require('./birthdayBot');
describe('birthdayBot', () => {
    test('Should wish birthday to Michel everyday', () => {
        expect(birthdayBot.greetsBirthdays(' ')).toStrictEqual('Joyeux anniversaire Michel Anniversaire');
    });
    test('Should return happy birthday to users with the same birthday', () => {
        expect(birthdayBot.getBirthdaysToGreet('20 Mai')).toMatchObject([
            'Joyeux anniversaire Thomas Price',
            'Joyeux anniversaire Peter Parker',
        ]);
    });
});
