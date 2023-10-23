const { App } = require('@slack/bolt');
const { WebClient } = require('@slack/web-api');
require('dotenv').config();

const app = new App({
    token: process.env.SLACK_BOT_TOKEN,
    signingSecret: process.env.SLACK_SIGNING_SECRET,
});


(async () => {
    await app.start(process.env.PORT || 3000);
    console.log('Hello World! The chatbot is online!');
})();

let currentMessage = null;

app.event('app_home_opened', async ({ event, say }) => {
    console.log('Hello! Someone opened the app, and we will send a message!');

    // Se c'è un messaggio corrente, lo cancelliamo
    if (currentMessage) {
        try {
            await app.client.chat.delete({
                channel: event.user,
                ts: currentMessage.ts,
            });
        } catch (error) {
            console.error('Error deleting previous message:', error);
        }
    }
    // Invia il nuovo messaggio
    const response = await say(`Hello <@${event.user}>!`);
    // Memorizza il nuovo messaggio
    currentMessage = response.message;
});


app.command('/presence', async ({ ack, body, client }) => {
    await ack();

    try {
        const result = await client.views.open({
            trigger_id: body.trigger_id,
            view: {
                type: "modal",
                title: {
                    type: "plain_text",
                    text: "My App",
                    emoji: true
                },
                submit: {
                    type: "plain_text",
                    text: "Submit",
                    emoji: true
                },
                close: {
                    type: "plain_text",
                    text: "Cancel",
                    emoji: true
                },
                blocks: [
                    {
                        type: "header",
                        text: {
                            type: "plain_text",
                            text: "Présence",
                            emoji: true
                        }
                    },
                    {
                        type: "input",
                        element: {
                            type: "datepicker",
                            initial_date: "2023-10-01",
                            placeholder: {
                                type: "plain_text",
                                text: "Select a date",
                                emoji: true
                            },
                            action_id: "datepicker-action"
                        },
                        label: {
                            type: "plain_text",
                            text: "Semaine",
                            emoji: true
                        }
                    },
                    {
                        type: "section",
                        text: {
                            type: "mrkdwn",
                            text: "This is a section block with checkboxes."
                        },
                        accessory: {
                            type: "checkboxes",
                            options: [
                                {
                                    text: {
                                        type: "mrkdwn",
                                        text: "*Lundi*"
                                    },
                                    value: "value-0"
                                },
                                {
                                    text: {
                                        type: "mrkdwn",
                                        text: "*Mardi*"
                                    },
                                    value: "value-1"
                                },
                                {
                                    text: {
                                        type: "mrkdwn",
                                        text: "*Mercredi*"
                                    },
                                    value: "value-2"
                                },
                                {
                                    text: {
                                        type: "mrkdwn",
                                        text: "*Jeudi*"
                                    },
                                    value: "value-3"
                                },
                                {
                                    text: {
                                        type: "mrkdwn",
                                        text: "*Vendredi*"
                                    },
                                    value: "value-4"
                                }
                            ],
                            action_id: "checkboxes-action"
                        }
                    }
                ]
            }
        });
    } catch (error) {
        console.log(error);
    }
});




// VIEW submission per recuperare dati json
app.view('view_submission', async ({ ack, body, view, client }) => {
    // Acknowledge the view submission
    await ack();

    // Estrai i valori dal view state
    const datepickerValue = view.state.values['datepicker-action']['datepicker-action'].selected_date;
    const checkboxesValues = view.state.values['checkboxes-action']['checkboxes-action'].selected_options;

    // Costruisci il messaggio da inviare nel canale
    const message = `Data selezionata: ${datepickerValue}\nGiorni selezionati: ${checkboxesValues.map(option => option.text).join(', ')}`;

    // Invia il messaggio nel canale Slack
    await client.chat.postMessage({
        channel: 'C062C79CDRN', // Sostituisci con il nome o l'ID del canale in cui desideri inviare il messaggio
        text: message,
    });
});
