const bot = require('./bot');

describe('bot', () => {
    const message = {
        type: 'MESSAGE',
        message: { text: 'Toto', sender: { displayName: 'Michel' } },
        space: { displayName: 'some room' },
    };
    test('should be a function', () => {
        expect(bot).toBeInstanceOf(Function);
    });
    test.skip('should return a hello world message', () => {
        expect(bot()).toBe('Hello World!');
    });
    test.skip('should return a hello message with a name', () => {
        expect(bot(message)).toBe('Hello Michel!');
    });
});
