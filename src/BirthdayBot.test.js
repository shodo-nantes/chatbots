const bot = require('./Bot');

const expectedMichelBirthdayMessage = {
    text: 'Joyeux anniversaire Michel Anniversaire',
};

describe('bot', () => {
    test('Should wish birthday to Michel everyday', () => {
        expect(bot.greetsAllBirthday('12 Decembre 2024')).toStrictEqual(expectedMichelBirthdayMessage);
        expect(bot.greetsAllBirthday('14 Janvier 2024')).toStrictEqual(expectedMichelBirthdayMessage);
    });

    test('Should wish a birthday to Thomas Price on the 20th May 2023', () => {
        expect(bot.greetsAllBirthday('20 Mai 2023')).toStrictEqual({
            text: 'Joyeux anniversaire Thomas Price',
        });
        expect(bot.greetsAllBirthday('20 Mai 202')).toStrictEqual({
            text: 'Joyeux anniversaire Thomas Price',
        });
    });

    test('Should wish a happy birthday to Gwenn Stacy on the 10th April 2023', () => {
        expect(bot.greetsAllBirthday('10 Avril 2023')).toStrictEqual({
            text: 'Joyeux anniversaire Gwenn Stacy',
        });
    });
    test('Should wish a happy birthday to Gwenn Stacy on the 10th April every years', () => {
        expect(bot.greetsAllBirthday('10 Avril 2024')).toStrictEqual({
            text: 'Joyeux anniversaire Gwenn Stacy',
        });
    });

    // TODO souhaiter l'anniversaire de 2 personnes en même temps
});
