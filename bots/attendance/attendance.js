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

const HELP_MESSAGE = `Usage: @attendance-chatbot [-h|--help|help] jours_de_la_semaine
Ce bot retranscrit les "jours de la semaine" renseignés par une personne dans le canal, et les affiche dans un format visuellement plus sympa (avec des emojis).L'objectif initial étant de pouvoir dénombrer les personnes présentes dans les locaux de Shodo pour s'organiser en conséquence.Actuellement les informations données au bot ne sont ni stockage, ni synthétisées.

Arguments de la commande:

    [-h|--help|help] : argument optionnel permettant d'afficher le présent texte.

    jours_de_la_semaine : argument de 5 caractères à donner au bot, permettant de décrire sa semaine aux autres Shodoers et Shodoeuses.
    Liste des symboles proposés par le bot : 
    - ✅ Présent•e (dans les locaux).
        Symboles : "o", "O", "0", "v", "V" ou "✅" 
    - ❌ Absent•e (des locaux et ne présage pas d'un autre type d'absence)
        Symboles : "x" et "par défaut" tout symbole non supporté par ailleurs
    - ❓ Je ne sais pas
        Symboles : "?", "❓"
    - 🏠 En remote (travaille depuis chez soi).
        Symboles : "r", "R", "🏠"
    - 💼 En clientèle (présentiel chez le client).
        Symboles : "c", "C", "💼"
    - 🏝️ Holidays (en été) (vacances, mais le "v" est déjà pris).
        Symboles : "h", "H", "🏝️"
    - 🎿 Holidays (en hiver) (vacances, mais le "v" est déjà pris).
        Symboles : "h", "H", "🎿"
`;

const ATTENDANCE_LABEL_MAPPINGS = [
    { keys: 'oO0vV✅', label: '✅' },
    { keys: '?', label: '❓' },
];

const FALLBACK_LABEL = '❌';

const HELP_FLAGS = new Set(['help', '-h', '--help']);

/**
 * Creates a Google Chat Message
 * @param {string} message the sender's message.
 * @param {string} sender the sender's display name.
 * @return {Object} a card with the user's avatar.
 */
function createMessage(message, sender) {
    const messageTest = interpretMessage(message, sender);
    return { text: messageTest };
}

function interpretMessage(inputMessage, sender) {
    const [command, ...commandArguments] = inputMessage.split(/\s+/);

    return isAttendanceCommand(command)
        ? interpretAttendanceCommand(commandArguments, sender)
        : `Unknown command "${command}"`;
}

function isAttendanceCommand(command) {
    return ['@attendance-chatbot', '/attendance'].includes(command);
}

function displayHelpMessage() {
    return HELP_MESSAGE;
}

function interpretAttendanceCommand(commandArguments, sender) {
    return containsHelpFlag(commandArguments)
        ? displayHelpMessage()
        : displaySenderWithAttendance(sender, commandArguments[0]);
}

function containsHelpFlag(commandArguments) {
    return commandArguments.some((commandArgument) => HELP_FLAGS.has(commandArgument));
}

function displaySenderWithAttendance(sender, commandArguments) {
    return `${sender} : ${displayAttendanceWorkWeek(commandArguments)}`;
}

function displayAttendanceWorkWeek(attendance) {
    // eslint-disable-next-line unicorn/no-useless-spread
    return [...attendance.padEnd(5, 'x').slice(0, 5)].map((item) => singleLabelForChar(item)).join(' | ');
}

function singleLabelForChar(attendanceElement) {
    const mapping = ATTENDANCE_LABEL_MAPPINGS.find(({ keys }) => keys.includes(attendanceElement));
    return (mapping && mapping.label) || FALLBACK_LABEL;
}
