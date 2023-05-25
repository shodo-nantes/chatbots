/**
 * Google Cloud Function that responds to messages sent in
 * Google Chat.
 *
 * @param {Object} request Request sent from Google Chat.
 * @param {Object} response Response to send back.
 */
exports.attendance = function attendance(request, response) {
    if (request.method === 'GET' || !request.body.message) {
        response.send('Hello! This function is meant to be used in a Google Chat Space.');
    }

    const message = request.body.message.text;
    const sender = request.body.message.sender.displayName;
    console.info(`message : ${message}`);
    console.info(`sender : ${sender}`);
    const data = createMessage(message, sender);

    response.send(data);
};

/**
 * Creates a card with two widgets.
 * @param {string} message the sender's display name.
 * @return {Object} a card with the user's avatar.
 */
function createMessage(message, sender) {
    const user = `${sender} : `;
    const result = user + compute(message);

    console.info(`result : ${result}`);
    return { text: result };
}

function compute(infoAttendance) {
    const attendance = infoAttendance.replace('@attendance-chatbot ', '').replace('/attendance ', '');
    let pos = 0;
    const s = toto(attendance.charAt(pos++));
    const s1 = toto(attendance.charAt(pos++));
    const s2 = toto(attendance.charAt(pos++));
    const s3 = toto(attendance.charAt(pos++));
    const s4 = toto(attendance.charAt(pos++));
    return `${s} | ${s1} | ${s2} | ${s3} | ${s4}`;
}

function isPresent(attendanceElement) {
    return (
        attendanceElement === 'o' ||
        attendanceElement === 'O' ||
        attendanceElement === '0' ||
        attendanceElement === 'v' ||
        attendanceElement === 'V'
    );
}

function toto(attendanceElement) {
    console.info(`element : ${attendanceElement}`);
    return isPresent(attendanceElement) ? '✅' : attendanceElement === '?' ? '❓' : '❌';
}
