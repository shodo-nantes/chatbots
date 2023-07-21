/**
 * Google Cloud Function that responds to messages sent in
 * Google Chat.
 *
 * @param {Object} request Request sent from Google Chat.
 * @param {Object} response Response to send back.
 */
module.exports = function attendance(request, response) {
    if (request.method === 'GET' || !request.body.message) {
        response.send('Hello! This function is meant to be used in a Google Chat Space.');
        return;
    }

    const message = request.body.message.text;
    const sender = request.body.message.sender.displayName;
    const data = createMessage(message, sender);

    response.send(data);
};

const ATTENDANCE_LABEL_MAPPINGS = [
    { keys: 'oO0vV✅', label: '✅' },
    { keys: '?', label: '❓' },
];

const FALLBACK_LABEL = '❌';

/**
 * Creates a card with two widgets.
 * @param {string} message the sender's message.
 * @param {string} sender the sender's display name.
 * @return {Object} a card with the user's avatar.
 */
function createMessage(message, sender) {
    const commandResult = interpretMessage(message);

    const messageTest = `${sender} : ${commandResult}`;
    return { text: messageTest };
}

function interpretMessage(inputMessage) {
    const [command, commandArguments] = inputMessage.split(/\s+/);

    return isAttendanceCommand(command) ? displayAttendanceWorkWeek(commandArguments) : `Unknown command "${command}"`;
}

function isAttendanceCommand(command) {
    return ['@attendance-chatbot', '/attendance'].includes(command);
}

function displayAttendanceWorkWeek(attendance) {
    // eslint-disable-next-line unicorn/no-useless-spread
    return [...attendance.padEnd(5, 'x').slice(0, 5)].map((item) => singleLabelForChar(item)).join(' | ');
}

function singleLabelForChar(attendanceElement) {
    const mapping = ATTENDANCE_LABEL_MAPPINGS.find(({ keys }) => keys.includes(attendanceElement));
    return (mapping && mapping.label) || FALLBACK_LABEL;
}
