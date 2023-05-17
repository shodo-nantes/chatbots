function botResponse(message) {
    return { text: message };
}

function bot(message) {
    if (message?.sender?.displayName) {
        return botResponse(`Hello ${message.sender.displayName}!`);
    }
    return botResponse('Hello World!');
}

module.exports = bot;
