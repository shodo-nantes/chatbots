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

        it('when message is oO0vV then should return ✅ | ✅ | ✅ | ✅ | ✅', () => {
            request.body.message.text += 'oO0vV';
            attendance(request, response);

            expect(response.send).toHaveBeenCalledWith({
                text: 'John Doe : ✅ | ✅ | ✅ | ✅ | ✅',
            });
        });

        it('when message is xox?x then should return ❌ | ✅ | ❌ | ❓ | ❌', () => {
            request.body.message.text += 'xox?x';
            attendance(request, response);

            expect(response.send).toHaveBeenCalledWith({
                text: 'John Doe : ❌ | ✅ | ❌ | ❓ | ❌',
            });
        });

        it('when message is xox?x and start with /attendance then should return ❌ | ✅ | ❌ | ❓ | ❌', () => {
            request.body.message.text = '/attendance xox?x';
            attendance(request, response);

            expect(response.send).toHaveBeenCalledWith({
                text: 'John Doe : ❌ | ✅ | ❌ | ❓ | ❌',
            });
        });
    });
});
