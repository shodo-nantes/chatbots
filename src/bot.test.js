const bot = require('./bot');

describe('bot', () => {
    test('should return a hello world message', () => {
        expect(bot()).toStrictEqual({
            text: 'Hello World!',
        });
    });

    test('should return a hello Michel message when message with sender michel', () => {
        expect(
            bot({
                sender: {
                    displayName: 'Michel',
                },
            }),
        ).toStrictEqual({
            text: 'Hello Michel!',
        });
    });

    test('should return a hello Machin message when message with sender Machin', () => {
        expect(
            bot({
                sender: {
                    displayName: 'Machin',
                },
            }),
        ).toStrictEqual({
            text: 'Hello Machin!',
        });
    });
});
