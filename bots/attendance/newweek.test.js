const { newWeek } = require('./newweek');
const MockDate = require('mockdate');
const fakeClient = {
    chat: {
        postMessage: () => {
            /*nothing to do*/
        },
    },
};

const currentWeekMessage = 'Semaine du 04/12/2023 au 08/12/2023 [NEWWEEK]';
const nextWeekMessage = 'Semaine du 11/12/2023 au 15/12/2023 [NEWWEEK]';

test('Test today is tuesday', async () => {
    MockDate.set('2023-12-05');
    const weekMessage = await newWeek(fakeClient);
    expect(weekMessage).toBe(currentWeekMessage);
});

test('Test today is wednesday', async () => {
    MockDate.set('2023-12-06');
    const weekMessage = await newWeek(fakeClient);
    expect(weekMessage).toBe(currentWeekMessage);
});

test('Test today is monday', async () => {
    MockDate.set('2023-12-04');
    const weekMessage = await newWeek(fakeClient);
    expect(weekMessage).toBe(currentWeekMessage);
});

test('Test today is thursday', async () => {
    MockDate.set('2023-12-07');
    const weekMessage = await newWeek(fakeClient);
    expect(weekMessage).toBe(currentWeekMessage);
});

test('Test today is friday', async () => {
    MockDate.set('2023-12-08');
    const weekMessage = await newWeek(fakeClient);
    expect(weekMessage).toBe(nextWeekMessage);
});

test('Test today is saturday', async () => {
    MockDate.set('2023-12-09');
    const weekMessage = await newWeek(fakeClient);
    expect(weekMessage).toBe(nextWeekMessage);
});

test('Test today is sunday', async () => {
    MockDate.set('2023-12-10');
    const weekMessage = await newWeek(fakeClient);
    expect(weekMessage).toBe(nextWeekMessage);
});

test('Test today is monday', async () => {
    MockDate.set('2023-12-11');
    const weekMessage = await newWeek(fakeClient);
    expect(weekMessage).toBe(nextWeekMessage);
});
