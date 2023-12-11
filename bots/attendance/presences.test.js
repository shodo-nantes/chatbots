const { normalizeUserAttendance, generateEmojiResponse, bodyTextIsInvalid } = require('./presences');

describe('Attendance', () => {
    describe('Normalize user attendance', () => {
        test('VVVVV becomes vvvvv', () => {
            expect(normalizeUserAttendance('VVVVV')).toBe('vvvvv');
        });
        test('XXXXX becomes xxxxx', () => {
            expect(normalizeUserAttendance('XXXXX')).toBe('xxxxx');
        });
        test('11111 becomes vvvvv', () => {
            expect(normalizeUserAttendance('11111')).toBe('vvvvv');
        });
        test('????? becomes ?????', () => {
            expect(normalizeUserAttendance('?????')).toBe('?????');
        });
        test('00000 becomes xxxxx', () => {
            expect(normalizeUserAttendance('00000')).toBe('xxxxx');
        });
        test('vvvvv becomes vvvvv', () => {
            expect(normalizeUserAttendance('vvvvv')).toBe('vvvvv');
        });
        test('vV?xX becomes vv?xx', () => {
            expect(normalizeUserAttendance('vV?xX')).toBe('vv?xx');
        });
        test('0x1v? becomes xxvv?', () => {
            expect(normalizeUserAttendance('0x1v?')).toBe('xxvv?');
        });
    });

    describe('Generate emoji response', () => {
        test('vvxx? = ✅✅❌❌❓ ', () => {
            expect(generateEmojiResponse('vvxx?')).toBe('✅✅❌❌❓');
        });
    });

    describe('Body text has 5 chars', () => {
        test('vvxx is invalid', () => {
            expect(bodyTextIsInvalid({ text: 'vvxx' })).toBe(true);
        });
        test('vvvvvv is invalid', () => {
            expect(bodyTextIsInvalid({ text: 'vvvvvv' })).toBe(true);
        });
        test('????? is valid', () => {
            expect(bodyTextIsInvalid({ text: '?????' })).toBe(false);
        });
    });
});
