function bot(message) {
    if (message?.sender?.displayName) {
        return botResponse(`Hello ${message.sender.displayName}!`);
    }
    return botResponse('Hello World!');
}

function botResponse(message) {
    return { text: message };
}

module.exports = bot;
