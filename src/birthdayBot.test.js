const birthdayBot = require('./birthdayBot');

const expectedMichelBirthdayMessage = 'Joyeux anniversaire Michel Anniversaire';
const thomasPriceBirthday = 'Joyeux anniversaire Thomas Price';
describe('birthdayBot', () => {
    test('Should wish birthday to Michel everyday', () => {
        expect(birthdayBot.greetsBirthday(' ')).toStrictEqual(expectedMichelBirthdayMessage);
    });
    test('Should wish happy birthday to Thomas price on the 20th May 2023', () => {
        expect(birthdayBot.greetsBirthday('20 Mai 2023')).toStrictEqual(thomasPriceBirthday);
    });
    test('Should wish happy birthday to Thomas price on the 10th April 2023', () => {
        expect(birthdayBot.greetsBirthday('10 Avril 2023')).toStrictEqual('Joyeux anniversaire Gwenn Stacy');
    });
    test('Should wish happy birthday to Thomas price every 20th May', () => {
        expect(birthdayBot.greetsBirthday('20 Mai 2060')).toStrictEqual(thomasPriceBirthday);
    });
});
