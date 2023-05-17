function bot(message) {
    if (message?.message?.sender?.displayName) {
        return `Hello ${message.message.sender.displayName}!`;
    }
    return 'Hello World!';
}
module.exports = bot;
