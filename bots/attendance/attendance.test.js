const attendance = require('./attendance');

const ATTENDANCE_COMMAND = '@attendance-chatbot';
describe('Attendance', () => {
    it('when the request method is GET then should return a greeting message', () => {
        const request = { method: 'GET' };
        const response = { send: jest.fn() };

        attendance(request, response);

        expect(response.send).toHaveBeenCalledWith('Hello! This function is meant to be used in a Google Chat Space.');
    });

    describe('compute', () => {
        let request;
        let response;

        beforeEach(() => {
            request = {
                method: 'POST',
                body: {
                    message: {
                        text: `${ATTENDANCE_COMMAND} `,
                        sender: {
                            displayName: 'John Doe',
                        },
                    },
                },
            };
            response = { send: jest.fn() };
        });

        it('when message is empty then should return ❌ | ❌ | ❌ | ❌ | ❌', () => {
            attendance(request, response);

            expect(response.send).toHaveBeenCalledWith({
                text: 'John Doe : ❌ | ❌ | ❌ | ❌ | ❌',
            });
        });

        it('when message is xxxxx then should return ❌ | ❌ | ❌ | ❌ | ❌', () => {
            request.body.message.text += 'xxxxx';
            attendance(request, response);

            expect(response.send).toHaveBeenCalledWith({
                text: 'John Doe : ❌ | ❌ | ❌ | ❌ | ❌',
            });
        });

        it.each(['o', 'O', '0', 'v', 'V', '✅'])(
            'display ✅  for command indicating that user is present',
            (command) => {
                request.body.message.text += `xx${command}xx`;
                attendance(request, response);

                expect(response.send).toHaveBeenCalledWith({
                    text: 'John Doe : ❌ | ❌ | ✅ | ❌ | ❌',
                });
            },
        );

        it.each([...'azetyuip^$qsdfghjklmù*wxbn,;:!123456789'])(
            'display ❌  by default for any unknown command "%s"',
            (command) => {
                request.body.message.text += `oo${command}oo`;
                attendance(request, response);

                expect(response.send).toHaveBeenCalledWith({
                    text: 'John Doe : ✅ | ✅ | ❌ | ✅ | ✅',
                });
            },
        );

        describe('display single command at ', () => {
            it('first position', () => {
                request.body.message.text += 'oxxxx';
                attendance(request, response);

                expect(response.send).toHaveBeenCalledWith({
                    text: 'John Doe : ✅ | ❌ | ❌ | ❌ | ❌',
                });
            });

            it('second position', () => {
                request.body.message.text += 'xoxxx';
                attendance(request, response);

                expect(response.send).toHaveBeenCalledWith({
                    text: 'John Doe : ❌ | ✅ | ❌ | ❌ | ❌',
                });
            });

            it('third position', () => {
                request.body.message.text += 'xxoxx';
                attendance(request, response);

                expect(response.send).toHaveBeenCalledWith({
                    text: 'John Doe : ❌ | ❌ | ✅ | ❌ | ❌',
                });
            });

            it('fourth position', () => {
                request.body.message.text += 'xxxox';
                attendance(request, response);

                expect(response.send).toHaveBeenCalledWith({
                    text: 'John Doe : ❌ | ❌ | ❌ | ✅ | ❌',
                });
            });
            it('fifth position', () => {
                request.body.message.text += 'xxxxo';
                attendance(request, response);

                expect(response.send).toHaveBeenCalledWith({
                    text: 'John Doe : ❌ | ❌ | ❌ | ❌ | ✅',
                });
            });
        });

        describe('display additional ❌  for partial command', () => {
            it.each([...'ov✅🏠❓💼'])('when missing four last characters for command %s', (command) => {
                request.body.message.text += command;
                attendance(request, response);

                expect(response.send).toHaveBeenCalledWith({
                    text: expect.stringContaining(' | ❌ | ❌ | ❌ | ❌'),
                });
            });

            it('when missing three last characters', () => {
                request.body.message.text += 'oo';
                attendance(request, response);

                expect(response.send).toHaveBeenCalledWith({
                    text: 'John Doe : ✅ | ✅ | ❌ | ❌ | ❌',
                });
            });

            it('when missing two last characters', () => {
                request.body.message.text += 'ooo';
                attendance(request, response);

                expect(response.send).toHaveBeenCalledWith({
                    text: 'John Doe : ✅ | ✅ | ✅ | ❌ | ❌',
                });
            });

            it('when missing the last character', () => {
                request.body.message.text += 'oooo';
                attendance(request, response);

                expect(response.send).toHaveBeenCalledWith({
                    text: 'John Doe : ✅ | ✅ | ✅ | ✅ | ❌',
                });
            });
        });

        it.each(['x', 'o', '?', '-whatever'])('never display more than five attendance days', (extraText) => {
            request.body.message.text += `xoxox${extraText}`;
            attendance(request, response);

            expect(response.send).toHaveBeenCalledWith({
                text: 'John Doe : ❌ | ✅ | ❌ | ✅ | ❌',
            });
        });

        it.each(['?', '❓'])(
            `display ❓  for command indicating that user doesn't know if present or not`,
            (command) => {
                request.body.message.text += `xx${command}xx`;
                attendance(request, response);

                expect(response.send).toHaveBeenCalledWith({
                    text: 'John Doe : ❌ | ❌ | ❓ | ❌ | ❌',
                });
            },
        );

        it.each(['r', 'R', '🏠'])(`display 🏠 for command %s indicating that user works from home`, (command) => {
            request.body.message.text += `xx${command}xx`;
            attendance(request, response);

            expect(response.send).toHaveBeenCalledWith({
                text: 'John Doe : ❌ | ❌ | 🏠 | ❌ | ❌',
            });
        });

        it.each(['c', 'C', '💼'])(`display 💼 for command %s indicating that user works from home`, (command) => {
            request.body.message.text += `xx${command}xx`;
            attendance(request, response);

            expect(response.send).toHaveBeenCalledWith({
                text: 'John Doe : ❌ | ❌ | 💼 | ❌ | ❌',
            });
        });

        it.each(['@attendance-chatbot', '/attendance'])('triggers command for %s command prefix', (commandPrefix) => {
            request.body.message.text = `${commandPrefix} xox?x`;
            attendance(request, response);

            expect(response.send).toHaveBeenCalledWith({
                text: 'John Doe : ❌ | ✅ | ❌ | ❓ | ❌',
            });
        });

        it('display proper message when command and arguments are separated by multiple white spaces', () => {
            request.body.message.text += `    oxoxo`;
            attendance(request, response);

            expect(response.send).toHaveBeenCalledWith({
                text: 'John Doe : ✅ | ❌ | ✅ | ❌ | ✅',
            });
        });

        it('display error message when command is not known', () => {
            request.body.message.text = 'toto oxoxo';
            attendance(request, response);

            expect(response.send).toHaveBeenCalledWith({
                text: 'Unknown command "toto"',
            });
        });
    });

    describe('help', () => {
        let request;
        let response;

        beforeEach(() => {
            request = {
                method: 'POST',
                body: {
                    message: {
                        text: `${ATTENDANCE_COMMAND} `,
                        sender: {
                            displayName: 'John Doe',
                        },
                    },
                },
            };
            response = { send: jest.fn() };
        });

        it('print whole help message', () => {
            request.body.message.text = `${ATTENDANCE_COMMAND} help`;

            attendance(request, response);

            expect(response.send).toHaveBeenCalledWith({
                text: `Usage: @attendance-chatbot [-h|--help|help] jours_de_la_semaine
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
`,
            });
        });

        it.each(['help', '-h', '--help'])(
            'display help message when contains attendance and help flag %s',
            (helpFlag) => {
                request.body.message.text = `${ATTENDANCE_COMMAND} oxoxo ${helpFlag}`;

                attendance(request, response);

                expect(response.send).toHaveBeenCalledWith({
                    text: expect.stringContaining('Usage: @attendance-chatbot [-h|--help|help] jours_de_la_semaine'),
                });
            },
        );
    });
});
