const attendance = require('./attendance');

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
                        text: '@attendance-chatbot ',
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

        it.each([...'azertyuip^$qsdfghjklmù*wxcbn,;:!123456789'])(
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
            it('when missing four last characters', () => {
                request.body.message.text += 'o';
                attendance(request, response);

                expect(response.send).toHaveBeenCalledWith({
                    text: 'John Doe : ✅ | ❌ | ❌ | ❌ | ❌',
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

        it(`display ❓  for command indicating that user doesn't know if present or not`, () => {
            request.body.message.text += '?';
            attendance(request, response);

            expect(response.send).toHaveBeenCalledWith({
                text: 'John Doe : ❓ | ❌ | ❌ | ❌ | ❌',
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
                text: 'John Doe : Unknown command "toto"',
            });
        });
    });
});
